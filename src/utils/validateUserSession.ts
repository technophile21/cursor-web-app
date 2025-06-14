import { NextResponse } from 'next/server'
import { getSessionUser } from './auth'

export async function validateUserSession() {
	const { user, error } = await getSessionUser()
	
	if (error) return { error }
	
	if (!user) {
		return {
			error: NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}
	}

	return { user }
} 