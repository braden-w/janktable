import { env } from '$env/dynamic/public';
import { SEASON_ID } from '$lib/constants';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	try {
		const catalog = await getCatalog();
		// console.timeEnd('queryCourseTable');
		return json(catalog, {
			headers: {
				'Cache-Control': 'max-age=3600',
				'Access-Control-Allow-Origin': '*',
			},
		});
	} catch (e) {
		throw error(500, e as Error);
	}
}

const options = {
	method: 'GET',
	headers: {
		Cookie: env.PUBLIC_COURSETABLE_COOKIE ?? '',
		origin: 'https://www.coursetable.com',
		Referer: 'https://www.coursetable.com',
		'Content-Type': 'application/json',
	},
};

const getCatalog = async () => {
	try {
		const res = await fetch(
			`https://api.coursetable.com/api/static/catalogs/${SEASON_ID}.json`,
			options,
		);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error(err);
	}
};
