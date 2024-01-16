import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
	foreignKey,
	index,
	integer,
	numeric,
	primaryKey,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const seasons = sqliteTable('seasons', {
	season_code: text('season_code').primaryKey(),
	term: text('term'),
	year: integer('year'),
});

export const insertSeasonSchema = createInsertSchema(seasons);

export const courses = sqliteTable(
	'courses',
	{
		course_id: integer('course_id').primaryKey(),
		season_code: text('season_code')
			.notNull()
			.references(() => seasons.season_code),
		title: text('title'),
		short_title: text('short_title'),
		description: text('description'),
		requirements: text('requirements'),
		locations_summary: text('locations_summary'),
		times_long_summary: text('times_long_summary'),
		times_summary: text('times_summary'),
		times_by_day: text('times_by_day'),
		skills: text('skills'),
		areas: text('areas'),
		credits: real('credits'),
		syllabus_url: text('syllabus_url'),
		course_home_url: text('course_home_url'),
		regnotes: text('regnotes'),
		extra_info: text('extra_info'),
		rp_attr: text('rp_attr'),
		classnotes: text('classnotes'),
		final_exam: text('final_exam'),
		fysem: numeric('fysem'),
		sysem: numeric('sysem'),
		colsem: numeric('colsem'),
		average_rating: real('average_rating'),
		average_rating_n: integer('average_rating_n'),
		average_workload: real('average_workload'),
		average_workload_n: integer('average_workload_n'),
		average_rating_same_professors: real('average_rating_same_professors'),
		average_rating_same_professors_n: integer('average_rating_same_professors_n'),
		average_workload_same_professors: real('average_workload_same_professors'),
		average_workload_same_professors_n: integer('average_workload_same_professors_n'),
		last_offered_course_id: integer('last_offered_course_id'),
		same_course_id: integer('same_course_id').notNull(),
		same_course_and_profs_id: integer('same_course_and_profs_id').notNull(),
		last_enrollment_course_id: integer('last_enrollment_course_id'),
		last_enrollment: integer('last_enrollment'),
		last_enrollment_season_code: text('last_enrollment_season_code').references(
			() => seasons.season_code,
		),
	},
	(table) => {
		return {
			courses_last_enrollment_course_id_courses_course_id_fk: foreignKey(() => ({
				columns: [table.last_enrollment_course_id],
				foreignColumns: [table.course_id],
				name: 'courses_last_enrollment_course_id_courses_course_id_fk',
			})),
			courses_last_offered_course_id_courses_course_id_fk: foreignKey(() => ({
				columns: [table.last_offered_course_id],
				foreignColumns: [table.course_id],
				name: 'courses_last_offered_course_id_courses_course_id_fk',
			})),
		};
	},
);

export const insertCourseSchema = createInsertSchema(courses);

export const listings = sqliteTable(
	'listings',
	{
		listing_id: integer('listing_id').primaryKey(),
		course_id: integer('course_id')
			.notNull()
			.references(() => courses.course_id),
		school: text('school'),
		subject: text('subject').notNull(),
		number: text('number').notNull(),
		course_code: text('course_code'),
		section: text('section').notNull(),
		season_code: text('season_code')
			.notNull()
			.references(() => seasons.season_code),
		crn: integer('crn').notNull(),
	},
	(table) => {
		return {
			idx_season_code_crn_unique: uniqueIndex('idx_season_code_crn_unique').on(
				table.season_code,
				table.crn,
			),
			idx_seasonCourseSection_unique: index('idx_season_course_section_unique').on(
				table.season_code,
				table.subject,
				table.number,
				table.section,
			),
		};
	},
);

export const insertListingSchema = createInsertSchema(listings);

export const discussions = sqliteTable('discussions', {
	discussion_id: integer('discussion_id').primaryKey(),
	subject: text('subject').notNull(),
	number: text('number').notNull(),
	info: text('info'),
	locations_summary: text('locations_summary'),
	times_long_summary: text('times_long_summary'),
	times_summary: text('times_summary'),
	times_by_day: text('times_by_day'),
});

export const insertDiscussionSchema = createInsertSchema(discussions);

export const flags = sqliteTable('flags', {
	flag_id: integer('flag_id').primaryKey(),
	flag_text: text('flag_text').notNull(),
});

export const insertFlagSchema = createInsertSchema(flags);

export const demandStatistics = sqliteTable('demand_statistics', {
	course_id: integer('course_id')
		.primaryKey()
		.references(() => courses.course_id),
	latest_demand: integer('latest_demand'),
	latest_demand_date: text('latest_demand_date'),
	demand: text('demand'),
});

export const insertDemandStatisticsSchema = createInsertSchema(demandStatistics);

export const professors = sqliteTable('professors', {
	professor_id: integer('professor_id').primaryKey(),
	name: text('name').notNull(),
	email: text('email'),
	average_rating: real('average_rating'),
	average_rating_n: integer('average_rating_n'),
});

export const insertProfessorSchema = createInsertSchema(professors);

export const evaluationStatistics = sqliteTable('evaluation_statistics', {
	course_id: integer('course_id')
		.primaryKey()
		.references(() => courses.course_id),
	enrollment: integer('enrollment'),
	enrolled: integer('enrolled'),
	responses: integer('responses'),
	declined: integer('declined'),
	no_response: integer('no_response'),
	extras: text('extras'),
	avg_rating: real('avg_rating'),
	avg_workload: real('avg_workload'),
});

export const insertEvaluationStatisticsSchema = createInsertSchema(evaluationStatistics);

export const evaluationQuestions = sqliteTable('evaluation_questions', {
	question_code: text('question_code').primaryKey(),
	is_narrative: numeric('is_narrative'),
	question_text: text('question_text'),
	options: text('options'),
	tag: text('tag'),
});

export const insertEvaluationQuestionSchema = createInsertSchema(evaluationQuestions);

export const evaluationNarratives = sqliteTable('evaluation_narratives', {
	id: integer('id').primaryKey(),
	course_id: integer('course_id')
		.notNull()
		.references(() => courses.course_id),
	question_code: text('question_code')
		.notNull()
		.references(() => evaluationQuestions.question_code),
	comment: text('comment'),
	comment_neg: real('comment_neg'),
	comment_neu: real('comment_neu'),
	comment_pos: real('comment_pos'),
	comment_compound: real('comment_compound'),
});

export const insertEvaluationNarrativeSchema = createInsertSchema(evaluationNarratives);

export const evaluationRatings = sqliteTable('evaluation_ratings', {
	id: integer('id').primaryKey(),
	course_id: integer('course_id')
		.notNull()
		.references(() => courses.course_id),
	question_code: text('question_code')
		.notNull()
		.references(() => evaluationQuestions.question_code),
	rating: text('rating'),
});

export const insertEvaluationRatingSchema = createInsertSchema(evaluationRatings);

export const courseProfessors = sqliteTable(
	'course_professors',
	{
		course_id: integer('course_id').references(() => courses.course_id),
		professor_id: integer('professor_id').references(() => professors.professor_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.professor_id],
				name: 'course_professors_course_id_professor_id_pk',
			}),
		};
	},
);

export const insertCourseProfessorSchema = createInsertSchema(courseProfessors);

export const courseDiscussions = sqliteTable(
	'course_discussions',
	{
		course_id: integer('course_id').references(() => courses.course_id),
		discussion_id: integer('discussion_id').references(() => discussions.discussion_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.discussion_id],
				name: 'course_discussions_course_id_discussion_id_pk',
			}),
		};
	},
);
export const insertCourseDiscussionSchema = createInsertSchema(courseDiscussions);

export const courseFlags = sqliteTable(
	'course_flags',
	{
		course_id: integer('course_id').references(() => courses.course_id),
		flag_id: integer('flag_id').references(() => flags.flag_id),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.course_id, table.flag_id],
				name: 'course_flags_course_id_flag_id_pk',
			}),
		};
	},
);
export const insertCourseFlagSchema = createInsertSchema(courseFlags);

export const fasttextSimilars = sqliteTable(
	'fasttext_similars',
	{
		source: integer('source').references(() => courses.course_id),
		target: integer('target').references(() => courses.course_id),
		rank: integer('rank'),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.source, table.target],
				name: 'fasttext_similars_source_target_pk',
			}),
		};
	},
);

export const insertFasttextSimilarSchema = createInsertSchema(fasttextSimilars);

export const tfidfSimilars = sqliteTable(
	'tfidf_similars',
	{
		source: integer('source').references(() => courses.course_id),
		target: integer('target').references(() => courses.course_id),
		rank: integer('rank'),
	},
	(table) => {
		return {
			pk0: primaryKey({
				columns: [table.source, table.target],
				name: 'tfidf_similars_source_target_pk',
			}),
		};
	},
);

export const insertTfidfSimilarSchema = createInsertSchema(tfidfSimilars);
