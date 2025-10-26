import css from './NoteForm.module.css';
import { useId } from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import Loading from '@/app/loading';
interface NoteFormProps {
  onCancel: () => void;
}

interface HandleNewNoteProps {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const fieldId = useId();

  const queryClient = useQueryClient();

  const newNote = useMutation({
    mutationFn: (note: HandleNewNoteProps) => createNote(note),
    onSuccess: () => {
      toast.success('Note added!', { position: 'bottom-center' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  const handleNewNote = ({ title, content, tag }: HandleNewNoteProps) => {
    newNote.mutate({
      title: title,
      content: content,
      tag: tag,
    });
  };

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    setIsDisabled(true);
    handleNewNote(values);
    actions.resetForm();
  };

  const schema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title is too short')
      .max(50, 'Title is too long')
      .required('Title is required'),
    content: Yup.string().max(500, 'Too long'),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
      .required('Tag is required'),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isDisabled}
            >
              Create note
            </button>
          </div>
        </Form>
      </Formik>
      {newNote.isPending && <Loading />}
    </>
  );
}
