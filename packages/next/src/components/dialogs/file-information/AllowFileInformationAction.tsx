'use client';

import { useEffect, useRef } from 'react';
import { allowFile } from '@/actions/FileInformationDialogActions';
import { MessageType } from '@/types';
import { useSetAtom } from 'jotai';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { isDialogOpenAtom } from '@/lib/atoms/fileInformationDialog';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export const AllowFileInformationAction = ({
	uuid,
	isDrawer = false
}: {
	readonly isDrawer?: boolean | undefined;
	readonly uuid: string;
}) => {
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const [state, formAction] = useFormState(allowFile, {
		message: '',
		type: MessageType.Uninitialized
	});
	const queryClient = useQueryClient();

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			void queryClient.invalidateQueries({ queryKey: ['uploads'] });
			setIsDialogOpen(false);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, setIsDialogOpen, state, queryClient]);

	return (
		<form action={formAction} ref={formRef} className="w-full h-full">
			<input type="hidden" name="uuid" value={uuid} />
			<ConfirmationDialog
				description="This action will remove the file from quarantine and allow anyone with a link to access it."
				callback={() => formRef.current?.requestSubmit()}
			>
				{isDrawer ? (
					<Button variant="destructive" className="w-full">
						Allow file
					</Button>
				) : (
					<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
						Allow file
					</button>
				)}
			</ConfirmationDialog>
		</form>
	);
};
