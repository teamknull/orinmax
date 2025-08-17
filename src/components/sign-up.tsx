"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (password !== passwordConfirmation) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		await signUp.email({
			email,
			password,
			name: `${firstName} ${lastName}`,
			image: image ? await convertImageToBase64(image) : "",
			callbackURL: "/dashboard",
			fetchOptions: {
				onResponse: () => {
					setLoading(false);
				},
				onRequest: () => {
					setLoading(true);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
				onSuccess: async () => {
					toast.success("Account created successfully!");
					router.push("/dashboard");
				},
			},
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="first-name" className="text-foreground">
						First name
					</Label>
					<Input
						id="first-name"
						placeholder="Max"
						required
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="last-name" className="text-foreground">
						Last name
					</Label>
					<Input
						id="last-name"
						placeholder="Robinson"
						required
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
					/>
				</div>
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="email" className="text-foreground">
					Email
				</Label>
				<Input
					id="email"
					type="email"
					placeholder="m@example.com"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
				/>
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="password" className="text-foreground">
					Password
				</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="new-password"
					placeholder="Password"
					className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
				/>
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="password_confirmation" className="text-foreground">
					Confirm Password
				</Label>
				<Input
					id="password_confirmation"
					type="password"
					value={passwordConfirmation}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
					autoComplete="new-password"
					placeholder="Confirm Password"
					className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
				/>
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="image" className="text-foreground">
					Profile Image (optional)
				</Label>
				<div className="flex items-end gap-4">
					{imagePreview && (
						<div className="relative w-16 h-16 rounded-sm overflow-hidden">
							<Image
								src={imagePreview}
								alt="Profile preview"
								fill
								className="object-cover"
							/>
						</div>
					)}
					<div className="flex items-center gap-2 w-full">
						<Input
							id="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full bg-background/50 border-border/50 text-foreground file:bg-background/50 file:border-border/50 file:text-foreground"
						/>
						{imagePreview && (
							<X
								className="cursor-pointer text-foreground hover:text-muted-foreground"
								onClick={() => {
									setImage(null);
									setImagePreview(null);
								}}
							/>
						)}
					</div>
				</div>
			</div>
			
			<Button
				type="submit"
				className="w-full"
				disabled={loading}
			>
				{loading ? (
					<Loader2 size={16} className="animate-spin mr-2" />
				) : null}
				Create an account
			</Button>
		</form>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}