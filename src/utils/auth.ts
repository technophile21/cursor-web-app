import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server'

export async function getSessionUser() {
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
			user: user,
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