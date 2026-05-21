USE [master]
GO

CREATE DATABASE [MS_UserMgmt]
GO

USE [MS_UserMgmt]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](25) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[UserDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Fullname] [nvarchar](250) NULL,
	[PhotoUrl] [nvarchar](500) NULL,
	[Address] [nvarchar](500) NULL,
	[Phone] [nvarchar](20) NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[RoleId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (1, N'Admin', CAST(N'2026-05-05T13:16:48.360' AS DateTime))
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (2, N'User', CAST(N'2026-05-05T13:16:55.420' AS DateTime))
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (3, N'Manager', CAST(N'2026-05-05T13:17:02.133' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO

SET IDENTITY_INSERT [dbo].[UserDetail] ON 
GO
INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (1, 1, N'Super Admin', NULL, N'Hyderabad', N'9999999999', CAST(N'2026-05-05T13:18:09.243' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[UserDetail] OFF
GO

SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (1, N'admin@app.com', N'$2a$12$NwiRYBBYlRKmuHrlsGYqW.aI4BWOhyP863yQPoSfvcuhObML1DKvO', 1, 1, CAST(N'2026-05-05T13:18:09.187' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO

ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED ([RoleName] ASC)
GO
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED ([Email] ASC)
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserDetail] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((2)) FOR [RoleId]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[UserDetail]  WITH CHECK ADD FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_ToRoles] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id])
GO

-- USE [master]
-- GO
-- /****** Object:  Database [MS_UserMgmt]    Script Date: 08/05/2026 10:03:07 ******/
-- CREATE DATABASE [MS_UserMgmt]
--  CONTAINMENT = NONE
--  ON  PRIMARY 
-- ( NAME = N'MS_UserMgmt', FILENAME = N'C:\Users\2483869\MS_UserMgmt.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
--  LOG ON 
-- ( NAME = N'MS_UserMgmt_log', FILENAME = N'C:\Users\2483869\MS_UserMgmt_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
--  WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET COMPATIBILITY_LEVEL = 160
-- GO
-- IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
-- begin
-- EXEC [MS_UserMgmt].[dbo].[sp_fulltext_database] @action = 'enable'
-- end
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ANSI_NULL_DEFAULT OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ANSI_NULLS OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ANSI_PADDING OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ANSI_WARNINGS OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ARITHABORT OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET AUTO_CLOSE OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET AUTO_SHRINK OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET AUTO_UPDATE_STATISTICS ON 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET CURSOR_CLOSE_ON_COMMIT OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET CURSOR_DEFAULT  GLOBAL 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET CONCAT_NULL_YIELDS_NULL OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET NUMERIC_ROUNDABORT OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET QUOTED_IDENTIFIER OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET RECURSIVE_TRIGGERS OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET  DISABLE_BROKER 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET DATE_CORRELATION_OPTIMIZATION OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET TRUSTWORTHY OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ALLOW_SNAPSHOT_ISOLATION OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET PARAMETERIZATION SIMPLE 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET READ_COMMITTED_SNAPSHOT OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET HONOR_BROKER_PRIORITY OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET RECOVERY SIMPLE 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET  MULTI_USER 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET PAGE_VERIFY CHECKSUM  
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET DB_CHAINING OFF 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET TARGET_RECOVERY_TIME = 60 SECONDS 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET DELAYED_DURABILITY = DISABLED 
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET ACCELERATED_DATABASE_RECOVERY = OFF  
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET QUERY_STORE = ON
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
-- GO
-- USE [MS_UserMgmt]
-- GO
-- /****** Object:  Table [dbo].[Roles]    Script Date: 08/05/2026 10:03:08 ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Roles](
-- 	[Id] [int] IDENTITY(1,1) NOT NULL,
-- 	[RoleName] [nvarchar](25) NOT NULL,
-- 	[CreatedAt] [datetime] NOT NULL,
-- PRIMARY KEY CLUSTERED 
-- (
-- 	[Id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- /****** Object:  Table [dbo].[UserDetail]    Script Date: 08/05/2026 10:03:08 ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[UserDetail](
-- 	[Id] [int] IDENTITY(1,1) NOT NULL,
-- 	[UserId] [int] NOT NULL,
-- 	[Fullname] [nvarchar](250) NULL,
-- 	[PhotoUrl] [nvarchar](500) NULL,
-- 	[Address] [nvarchar](500) NULL,
-- 	[Phone] [nvarchar](20) NULL,
-- 	[CreatedAt] [datetime] NOT NULL,
-- PRIMARY KEY CLUSTERED 
-- (
-- 	[Id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- /****** Object:  Table [dbo].[Users]    Script Date: 08/05/2026 10:03:08 ******/
-- SET ANSI_NULLS ON
-- GO
-- SET QUOTED_IDENTIFIER ON
-- GO
-- CREATE TABLE [dbo].[Users](
-- 	[Id] [int] IDENTITY(1,1) NOT NULL,
-- 	[Email] [nvarchar](150) NOT NULL,
-- 	[PasswordHash] [nvarchar](500) NOT NULL,
-- 	[RoleId] [int] NOT NULL,
-- 	[IsActive] [bit] NOT NULL,
-- 	[CreatedAt] [datetime] NOT NULL,
-- PRIMARY KEY CLUSTERED 
-- (
-- 	[Id] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- ) ON [PRIMARY]
-- GO
-- SET IDENTITY_INSERT [dbo].[Roles] ON 
-- GO
-- INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (1, N'Admin', CAST(N'2026-05-05T13:16:48.360' AS DateTime))
-- GO
-- INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (2, N'User', CAST(N'2026-05-05T13:16:55.420' AS DateTime))
-- GO
-- INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (3, N'Manager', CAST(N'2026-05-05T13:17:02.133' AS DateTime))
-- GO
-- SET IDENTITY_INSERT [dbo].[Roles] OFF
-- GO
-- SET IDENTITY_INSERT [dbo].[UserDetail] ON 
-- GO
-- INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (1, 1, N'Super Admin', NULL, N'Hyderabad', N'9999999999', CAST(N'2026-05-05T13:18:09.243' AS DateTime))
-- GO
-- SET IDENTITY_INSERT [dbo].[UserDetail] OFF
-- GO
-- SET IDENTITY_INSERT [dbo].[Users] ON 
-- GO
-- INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (1, N'admin@app.com', N'$2a$12$NwiRYBBYlRKmuHrlsGYqW.aI4BWOhyP863yQPoSfvcuhObML1DKvO', 1, 1, CAST(N'2026-05-05T13:18:09.187' AS DateTime))
-- GO
-- SET IDENTITY_INSERT [dbo].[Users] OFF
-- GO
-- SET ANSI_PADDING ON
-- GO
-- /****** Object:  Index [UQ__Roles__8A2B6160B594E396]    Script Date: 08/05/2026 10:03:08 ******/
-- ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
-- (
-- 	[RoleName] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- GO
-- SET ANSI_PADDING ON
-- GO
-- /****** Object:  Index [UQ__tmp_ms_x__A9D105343FF47831]    Script Date: 08/05/2026 10:03:08 ******/
-- ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
-- (
-- 	[Email] ASC
-- )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
-- GO
-- ALTER TABLE [dbo].[Roles] ADD  DEFAULT (getdate()) FOR [CreatedAt]
-- GO
-- ALTER TABLE [dbo].[UserDetail] ADD  DEFAULT (getdate()) FOR [CreatedAt]
-- GO
-- ALTER TABLE [dbo].[Users] ADD  DEFAULT ((2)) FOR [RoleId]
-- GO
-- ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
-- GO
-- ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
-- GO
-- ALTER TABLE [dbo].[UserDetail]  WITH CHECK ADD FOREIGN KEY([UserId])
-- REFERENCES [dbo].[Users] ([Id])
-- GO
-- ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_ToRoles] FOREIGN KEY([RoleId])
-- REFERENCES [dbo].[Roles] ([Id])
-- GO
-- ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_ToRoles]
-- GO
-- USE [master]
-- GO
-- ALTER DATABASE [MS_UserMgmt] SET  READ_WRITE 
-- GO
