CREATE TABLE `activityFeed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`action` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityFeed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('online','offline','working','idle') NOT NULL DEFAULT 'offline',
	`tasksCompleted` int NOT NULL DEFAULT 0,
	`lastActive` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`generatedBy` varchar(100) NOT NULL,
	`status` enum('pending','approved','rejected','iterating') NOT NULL DEFAULT 'pending',
	`imageUrl` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `noteLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceNoteId` int NOT NULL,
	`targetNoteId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `noteLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `researchData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeName` varchar(255) NOT NULL,
	`revenue` int NOT NULL,
	`products` int NOT NULL,
	`rating` varchar(10) NOT NULL,
	`trend` enum('up','down','stable') NOT NULL DEFAULT 'stable',
	`insights` text NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `researchData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`platform` enum('tiktok','instagram','youtube') NOT NULL,
	`scheduledTime` timestamp,
	`status` enum('draft','scheduled','published') NOT NULL DEFAULT 'draft',
	`thumbnailUrl` text,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
