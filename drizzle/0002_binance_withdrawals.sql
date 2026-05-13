CREATE TABLE `withdrawalRequests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `provider` enum('binance') NOT NULL DEFAULT 'binance',
  `status` enum('submitted','failed') NOT NULL,
  `coin` varchar(16) NOT NULL,
  `network` varchar(32),
  `address` text NOT NULL,
  `addressTag` varchar(128),
  `amount` varchar(64) NOT NULL,
  `walletType` int NOT NULL DEFAULT 0,
  `withdrawOrderId` varchar(128) NOT NULL,
  `providerWithdrawalId` varchar(128),
  `errorMessage` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `withdrawalRequests_id` PRIMARY KEY(`id`)
);
