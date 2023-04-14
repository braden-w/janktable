import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const {PUBLIC_COURSETABLE_COOKIE, PUBLIC_SUPABSE_URL, PUBLIC_ANON_KEY} = process.env;

const gqlQuery = `query evaluation_narratives_with_courses ($limit: Int, $offset: Int){
	evaluation_narratives (limit: $limit, offset: $offset) {
    id
    course_id
    comment
    comment_compound
    course {
      computed_listing_infos {
        all_course_codes
        areas
        average_gut_rating
        average_professor
        average_rating
        average_workload
        average_rating_same_professors
        average_workload_same_professors
        classnotes
        course_code
        credits
        crn
        description
        enrolled
        extra_info
        final_exam
        flag_info
        fysem
        last_enrollment
        last_enrollment_same_professors
        listing_id
        locations_summary
        number
        professor_ids
        professor_names
        regnotes
        requirements
        rp_attr
        same_course_id
        same_course_and_profs_id
        last_offered_course_id
        school
        season_code
        section
        skills
        subject
        syllabus_url
        times_by_day
        times_summary
        title
      }
    }
  }
}`;


// Define a function to fetch results in batches of 5000
async function fetchBatchedResults({offset, limit}) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: PUBLIC_COURSETABLE_COOKIE

    },
    body: JSON.stringify({
      query: gqlQuery,
      variables: {
        limit,
        offset
      }
    })
  }

  const response = await fetch('https://api.coursetable.com/ferry/v1/graphql', options);
  const {data} = await response.json();
  const {evaluation_narratives} = data;
  const flattenedResults = evaluation_narratives.map(({course: {computed_listing_infos: [course]}, ...rest}) => ({
    ...rest,
    ...course
  }));
  return flattenedResults;
}

// Define a function to fetch all results using Promise.all
async function fetchAllResults() {
  const limit = 5000;
  const batchSize = 8;

  async function fetchBatchResults(offset) {
    const batchPromises = Array.from({length: batchSize}, (_, i) => fetchBatchedResults({offset: offset + i * limit, limit})
    );
    return Promise.all(batchPromises);
  }

  const flattenResults = (acc, results) => [...acc, ...results];

  const isBatchEmpty = (batchResults) => batchResults.every((results) => results.length === 0);

  async function fetchAndProcessBatches(offset, allResults) {
    const batchResults = await fetchBatchResults(offset);

    if (isBatchEmpty(batchResults)) {
      return allResults;
    }

    const newAllResults = batchResults.reduce(flattenResults, allResults);
    return fetchAndProcessBatches(offset + batchSize * limit, newAllResults);
  }

  return fetchAndProcessBatches(0, []);
}


// Call the fetchAllResults function and log the results
fetchAllResults().then((results) => {
  console.log(results);
}).catch((error) => {
  console.error(error);
});
