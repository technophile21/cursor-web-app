'use client';

import Modal from './Modal';
import TextInput from './form/TextInput';
import RadioGroup from './form/RadioGroup';
import Button from './form/Button';

export interface CreateApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  setName: (name: string) => void;
  keyType: string;
  setKeyType: (type: string) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export default function CreateApiKeyDialog({
  isOpen,
  onClose,
  name,
  setName,
  keyType,
  setKeyType,
  isLoading,
  error,
  handleSubmit,
  resetForm,
}: CreateApiKeyDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Create a new API key">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Key Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          error={error || undefined}
        />
        <RadioGroup
          name="keyType"
          options={[
            { value: 'development', label: 'Development', description: 'For testing purposes' },
            { value: 'production', label: 'Production', description: 'For live applications' },
          ]}
          value={keyType}
          onChange={setKeyType}
        />
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => { resetForm(); onClose(); }} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 