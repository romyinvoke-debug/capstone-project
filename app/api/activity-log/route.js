import { db } from '@/lib/db';
import { activityLog } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { desc, ilike, or, sql, eq } from 'drizzle-orm';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const actionFilter = searchParams.get('action') || '';
        const offset = (page - 1) * limit;

        const conditions = [];
        if (search) {
            conditions.push(
                or(
                    ilike(activityLog.userName, `%${search}%`),
                    ilike(activityLog.targetSummary, `%${search}%`)
                )
            );
        }
        if (actionFilter) {
            conditions.push(eq(activityLog.action, actionFilter));
        }

        let query = db.select().from(activityLog);
        let countQuery = db.select({ count: sql`count(*)` }).from(activityLog);

        if (conditions.length > 0) {
            const andCondition = sql`${sql.join(conditions, sql` AND `)}`;
            query = query.where(andCondition);
            countQuery = countQuery.where(andCondition);
        }

        const data = await query
            .orderBy(desc(activityLog.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await countQuery;
        const total = parseInt(totalResult[0]?.count || '0');

        return NextResponse.json({
            success: true,
            data: data.map(item => ({
                ...item,
                targetSummary: item.targetSummary ? JSON.parse(item.targetSummary) : null
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error('[ACTIVITY_LOG_GET_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
