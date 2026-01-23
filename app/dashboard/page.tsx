import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
	return (
		<div className="w-full h-full p-4 pb-2.5 pl-2">
			<div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 gap-2 min-h-full">
				<Card className="md:col-span-2 lg:row-span-2 lg:col-span-1 lg:col-start-1 rounded-lg">
					<CardContent className="w-full h-full ">
						<div className="flex flex-col md:flex-row lg:flex-col w-full h-full">
							<div className="flex-1">1.1</div>
							<div className="flex-1 rounded-lg">1.2</div>
						</div>
					</CardContent>
				</Card>
				<Card className="md:row-start-2 lg:col-start-2 lg:row-start-1 rounded-lg">
					<CardHeader>
						<CardTitle>Create project</CardTitle>
						<CardDescription>Deploy your new project in one-click.</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, ratione
							sit unde incidunt, eligendi facere placeat veniam illum maiores
							voluptatibus natus beatae.
						</div>
					</CardContent>
				</Card>
				<Card className="md:row-start-2 lg:col-start-3 lg:row-start-1 rounded-lg">
					<CardHeader>
						<CardTitle>Create project</CardTitle>
						<CardDescription>Deploy your new project in one-click.</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, ratione
							sit unde incidunt, eligendi facere placeat veniam illum maiores
							voluptatibus natus? Autem explicabo accusantium voluptatem possimus
							necessitatibus non delectus, corrupti quaerat alias repellendus, ea fuga
							officiis pariatur odit eligendi expedita, tempore a ratione error. Nam
							perferendis blanditiis quos veritatis beatae.
						</div>
					</CardContent>
				</Card>
				<Card className="md:col-span-2 lg:col-start-2 rounded-lg">
					<CardHeader>
						<CardTitle>Create project</CardTitle>
						<CardDescription>Deploy your new project in one-click.</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, ratione
							sit unde incidunt, eligendi facere placeat veniam illum maiores
							voluptatibus natus? Autem explicabo accusantium voluptatem possimus
							necessitatibus non delectus, corrupti quaerat alias repellendus, ea fuga
							officiis pariatur odit eligendi expedita, tempore a ratione error. Nam
							perferendis blanditiis quos veritatis beatae.
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
