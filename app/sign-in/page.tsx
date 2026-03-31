"use client";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "maeve.millay@acme-inc.com",
			password: "Password123!",
		},
	});

	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await signIn(data);
	}
	return (
		<div className="w-screen min-h-screen grid place-content-center fixed z-50 inset-0 bg-background">
			<Card className="w-80">
				<CardHeader>
					<CardTitle>Important Notice: </CardTitle>
					<CardDescription>
						This website is a demo version created for personal use. Please do not enter
						any sensitive or personal information, as the data submitted here is not
						stored securely and will be deleted every 24 hours. By using this site, you
						acknowledge that no liability will be accepted for any data entered. Thank
						you for understanding!
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="sign-in" onSubmit={form.handleSubmit(onSubmit)}>
						<Controller
							name="email"
							control={form.control}
							render={() => (
								<Input name="email" type="email" readOnly hidden required />
							)}
						/>
						<Controller
							name="password"
							control={form.control}
							render={() => <Input name="password" readOnly hidden required />}
						/>
					</form>
				</CardContent>
				<CardFooter className="flex-col gap-2">
					<Button type="submit" form="sign-in" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? <Spinner /> : "Continue"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
