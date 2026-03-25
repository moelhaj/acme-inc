"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

export interface SparklesIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SparklesIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const SPARKLE_VARIANTS: Variants = {
	initial: {
		y: 0,
		fill: "none",
	},
	animate: {
		y: [0, -1, 0, 0],
		fill: "currentColor",
		transition: {
			duration: 1,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "loop",
			ease: "easeInOut",
		},
	},
};

const STAR_VARIANTS: Variants = {
	initial: {
		opacity: 1,
		x: 0,
		y: 0,
	},
	blink: () => ({
		opacity: [0, 1, 0, 0, 0, 0, 1],
		transition: {
			duration: 2,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "loop",
			ease: "easeInOut",
		},
	}),
};

const SparklesIcon = forwardRef<SparklesIconHandle, SparklesIconProps>(
	({ className, size = 28, ...props }, ref) => {
		const starControls = useAnimation();
		const sparkleControls = useAnimation();

		const startAnimation = useCallback(() => {
			sparkleControls.start("animate");
			starControls.start("blink", { delay: 1 });
		}, [sparkleControls, starControls]);

		const stopAnimation = useCallback(() => {
			sparkleControls.start("initial");
			starControls.start("initial");
		}, [sparkleControls, starControls]);

		useImperativeHandle(ref, () => ({
			startAnimation,
			stopAnimation,
		}), [startAnimation, stopAnimation]);

		useEffect(() => {
			startAnimation();
		}, [startAnimation]);

		return (
			<div className={cn(className)} {...props}>
				<svg
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<motion.path
						animate={sparkleControls}
						d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
						variants={SPARKLE_VARIANTS}
					/>
					<motion.path animate={starControls} d="M20 3v4" variants={STAR_VARIANTS} />
					<motion.path animate={starControls} d="M22 5h-4" variants={STAR_VARIANTS} />
					<motion.path animate={starControls} d="M4 17v2" variants={STAR_VARIANTS} />
					<motion.path animate={starControls} d="M5 18H3" variants={STAR_VARIANTS} />
				</svg>
			</div>
		);
	},
);

SparklesIcon.displayName = "SparklesIcon";

export { SparklesIcon };
