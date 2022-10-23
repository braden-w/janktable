import type { SearchResponse } from '../../search/[keyword]/[course_keyword]/types';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

const options = ({ keyword, course_keyword }: { keyword: string; course_keyword: string }) => ({
	method: 'POST',
	headers: {
		Cookie: env.PUBLIC_COURSETABLE_COOKIE,
		origin: 'https://www.coursetable.com',
		Referer: 'https://www.coursetable.com',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		query: `query searchCoursesByKeyword ($keyword: String!, $course_keyword: String!) {
	courses (
		where: {
			_and: [
				{
					evaluation_narratives: {
						comment: {
							_ilike: $keyword
						}
					}
			},
			{
				course: {
					computed_listing_infos: {
						course_code: {
							_ilike: $course_keyword
						}
					}
				}
			}
			]
		}
	)
	{
		description
		title
		areas
		average_rating
		average_rating_same_professors
		average_workload
		average_workload_same_professors
		computed_listing_infos_aggregate {
			nodes {
				all_course_codes
				areas
				average_gut_rating
				average_professor
				course_code
				crn
			}
		}
		course_id
		description
		locations_summary
		requirements
		skills
		evaluation_narratives {
			comment
		}
	}
}
`,
		variables: {
			keyword,
			course_keyword
		}
	})
});

export const GET: RequestHandler = async ({url}: {url: URL}) => {
	const keyword = url.searchParams.get('keyword') ?? '%';
	const course_keyword = url.searchParams.get('course_keyword') ?? '%';
	const res = await fetch('https://api.coursetable.com/ferry/v1/graphql?=', options({keyword, course_keyword}));
	const response = await res.json() as SearchResponse;
	console.log("🚀 ~ file: +server.ts ~ line 78 ~ constGET:RequestHandler= ~ response", response)
	const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
	const options = { status: 200, statusText: 'OK' };
	return new Response(blob, options)

};
