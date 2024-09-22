import type { SVGProps } from "react"
const Pencil = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={24}
		height={24}
		fill='none'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		className='icon icon-tabler icons-tabler-outline icon-tabler-pencil'
		{...props}
	>
		<title>Pencil</title>
		<path stroke='none' d='M0 0h24v24H0z' />
		<path d='M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16v4M13.5 6.5l4 4' />
	</svg>
)
export default Pencil
