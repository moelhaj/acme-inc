export default function ProjectsLayout({
	children,
	sheet,
}: {
	children: React.ReactNode;
	sheet: React.ReactNode;
}) {
	return (
		<>
			{children}
			{sheet}
		</>
	);
}
