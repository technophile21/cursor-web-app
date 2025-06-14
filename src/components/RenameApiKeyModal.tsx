import React, { useState } from 'react'
import Modal from './Modal'
import { ApiKey } from '@/types/apiKey'

interface RenameApiKeyModalProps {
	isOpen: boolean
	onClose: () => void
	apiKey: ApiKey | null
	onRename: (id: string, newName: string) => Promise<void>
	existingNames: string[]
}

export default function RenameApiKeyModal({
	isOpen,
	onClose,
	apiKey,
	onRename,
	existingNames,
}: RenameApiKeyModalProps) {
	const [newName, setNewName] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!apiKey) return

		// Reset error state
		setError(null)

		// Validate name
		if (!newName.trim()) {
			setError('Name cannot be empty')
			return
		}

		// Check for duplicate names (excluding current key's name)
		const isDuplicate = existingNames
			.filter(name => name !== apiKey.name)
			.some(name => name.toLowerCase() === newName.toLowerCase())

		if (isDuplicate) {
			setError('An API key with this name already exists')
			return
		}

		try {
			setIsSubmitting(true)
			await onRename(apiKey.id, newName.trim())
			onClose()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to rename API key')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Reset form when modal opens/closes
	React.useEffect(() => {
		if (isOpen && apiKey) {
			setNewName(apiKey.name)
			setError(null)
		}
	}, [isOpen, apiKey])

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Rename API Key">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="apiKeyName"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						New Name
					</label>
					<input
						type="text"
						id="apiKeyName"
						value={newName}
						onChange={e => setNewName(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter new name"
						disabled={isSubmitting}
					/>
					{error && (
						<p className="mt-1 text-sm text-red-600">{error}</p>
					)}
				</div>
				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Renaming...' : 'Rename'}
					</button>
				</div>
			</form>
		</Modal>
	)
} 