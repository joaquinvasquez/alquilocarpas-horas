import type { SVGProps } from "react"
const Calendar = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={24}
		height={24}
		fill='none'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		className='icon icon-tabler icons-tabler-outline icon-tabler-calendar-search'
		{...props}
	>
		<title>Calendar</title>
		<path stroke='none' d='M0 0h24v24H0z' />
		<path d='M11.5 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5M16 3v4M8 3v4M4 11h16' />
		<path d='M15 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0M20.2 20.2 22 22' />
	</svg>
)
export default Calendar
