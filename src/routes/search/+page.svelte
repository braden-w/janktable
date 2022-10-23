<script lang="ts">
	import { MagnifyingGlass } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	let keyword = '';
	let courseKeyword = '';

	$: keywordWithPercents = `%${keyword}%`;
	$: courseKeywordWithPercents = `%${courseKeyword}%`;

	const onSubmit = async () => {
		// Send api request to search passing {keyword: keywordWithPercents, courseKeyword: courseKeywordWithPercents}
		const response = await fetch(
			`/api/search?keyword=${encodeURIComponent(
				keywordWithPercents
			)}&courseKeyword=${encodeURIComponent(courseKeywordWithPercents)}`
		);
		const data = await response.json();
	};
</script>

<div class="hero bg-base-100 text-base-content">
	<div class="hero-overlay h-screen bg-opacity-60" />
	<div class="hero-content">
		<div>
			<h2 class="mb-2 text-4xl font-extrabold md:text-6xl">Yale Course Keyword Search</h2>
			<h3 class="mb-4 text-3xl font-bold">
				A search box that allows you to search CourseTable reviews by keyword
			</h3>
			<!-- <p class="">Start by typing in this box:</p> -->
			<div class="w-full">
				<label for="search" class="sr-only">Search</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-400" aria-hidden="true" />
					</div>
					<input
						id="search"
						name="search"
						class="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
						placeholder="Search"
						type="search"
					/>
				</div>
			</div>
		</div>
	</div>
</div>