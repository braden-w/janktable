import { allCourseColumnNames } from '$lib/schema';
import { z } from 'zod';

export const selectedColumnsSchema = z
	.array(z.enum(allCourseColumnNames))
	.transform((value) => [...new Set(value)]);

export const DEFAULT_SELECTED_COLUMNS: z.infer<typeof selectedColumnsSchema> = [
	'course_id',
	'title',
	'description',
	'skills',
	'areas',
	'credits',
	'syllabus_url',
	'average_rating',
	'average_workload',
	'average_rating_same_professors',
	'average_workload_same_professors',
	'average_comment_neg',
	'average_comment_neu',
	'average_comment_pos',
	'average_comment_compound',
] as const;

export const orderByConfigSchema = z
	.object({ column: z.enum(allCourseColumnNames), direction: z.enum(['asc', 'desc']) })
	.array();

type OrderByConfig = z.infer<typeof orderByConfigSchema>;

export const DEFAULT_ORDER_BY_CONFIG = [
	{ column: 'average_comment_compound', direction: 'desc' },
	{ column: 'average_rating', direction: 'desc' },
] satisfies OrderByConfig;
