import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface SessionUser {
	id: string
	email: string
}

export async function requireAuth() {
	const session = await getServerSession();
	
	if (!session) {
		redirect("/");
	}
	
	return session;
}

export async function getSessionUser(): Promise<{ user: SessionUser | null; error: NextResponse | null }> {
	try {
		const session = await getServerSession();

		if (!session?.user?.email) {
			return {
				user: null,
				error: NextResponse.json(
					{ error: 'Unauthorized' },
					{ status: 401 }
				)
			}
		}

		// Initialize Supabase client
		const supabase = createRouteHandlerClient({ cookies })

		// Get user from database using email
		const { data: user, error: userError } = await supabase
			.from('users')
			.select('id')
			.eq('email', session.user.email)
			.single()

		if (userError || !user) {
			return {
				user: null,
				error: NextResponse.json(
					{ error: 'User not found' },
					{ status: 404 }
				)
			}
		}

		return {
			user: {
				id: user.id,
				email: session.user.email
			},
			error: null
		}
	} catch (error) {
		console.error('Error getting session user:', error)
		return {
			user: null,
			error: NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			)
		}
	}
} 