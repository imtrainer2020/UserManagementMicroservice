USE [master]
GO

CREATE DATABASE [MS_UserMgmt]
GO

USE [MS_UserMgmt]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 09/06/2026 11:38:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](25) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserDetail]    Script Date: 09/06/2026 11:38:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Fullname] [nvarchar](250) NULL,
	[PhotoUrl] [nvarchar](500) NULL,
	[Address] [nvarchar](500) NULL,
	[Phone] [nvarchar](20) NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRolesMapping]    Script Date: 09/06/2026 11:38:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRolesMapping](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 09/06/2026 11:38:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[RoleId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (1, N'Admin', CAST(N'2026-05-05T13:16:48.360' AS DateTime))
GO
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (2, N'User', CAST(N'2026-05-05T13:16:55.420' AS DateTime))
GO
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (3, N'Manager', CAST(N'2026-05-05T13:17:02.133' AS DateTime))
GO
INSERT [dbo].[Roles] ([Id], [RoleName], [CreatedAt]) VALUES (2003, N'Teacher', CAST(N'2026-05-08T11:07:56.353' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[UserDetail] ON 
GO
INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (1, 1, N'Super Admin', NULL, N'Hyderabad', N'9999999999', CAST(N'2026-05-05T13:18:09.243' AS DateTime))
GO
INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (1002, 2, N'Amal Clooney', N'https://thf.bing.com/th/id/OIP.Me_Me9j_3IGFeOkPRDPp5QHaHa?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3', NULL, NULL, CAST(N'2026-05-22T11:24:19.690' AS DateTime))
GO
INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (1003, 1003, N'George Clooney', N'https://thf.bing.com/th/id/OIP.agvbzW3wwwtdldApVO3jEgHaJl?r=0&cb=thfc1falcon&pid=ImgDet&w=195&h=251&c=7&dpr=1.7&o=7&rm=3', NULL, NULL, CAST(N'2026-05-22T11:29:56.033' AS DateTime))
GO
INSERT [dbo].[UserDetail] ([Id], [UserId], [Fullname], [PhotoUrl], [Address], [Phone], [CreatedAt]) VALUES (2002, 2003, N'Tom Cruise', N'https://preview.redd.it/young-tom-cruise-v0-2tz2a3cz3jf81.jpg?width=750&format=pjpg&auto=webp&s=2b4932ae5e8ca22699d1df01c7074e4f45139e4a', NULL, NULL, CAST(N'2026-05-22T12:09:48.233' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[UserDetail] OFF
GO
INSERT [dbo].[UserRolesMapping] ([UserId], [RoleId]) VALUES (2, 2)
GO
INSERT [dbo].[UserRolesMapping] ([UserId], [RoleId]) VALUES (1002, 4)
GO
INSERT [dbo].[UserRolesMapping] ([UserId], [RoleId]) VALUES (1003, 3)
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (1, N'admin@app.com', N'$2a$12$NwiRYBBYlRKmuHrlsGYqW.aI4BWOhyP863yQPoSfvcuhObML1DKvO', 1, 1, CAST(N'2026-05-05T13:18:09.187' AS DateTime))
GO
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (2, N'user@app.com', N'$2a$11$FCRfT7BrR65UNNJP8thqHej38FykXsVVa7ayBLHHRjnaZPoI.CQ8i', 2, 1, CAST(N'2026-05-09T17:37:19.803' AS DateTime))
GO
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (1003, N'manager@app.com', N'$2a$11$ssqoMmL.iBV73SnfHGVT8uVB88OJpQKzR7098eR3..6CAzc3zo9nG', 3, 1, CAST(N'2026-05-18T05:48:23.717' AS DateTime))
GO
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [RoleId], [IsActive], [CreatedAt]) VALUES (2003, N'user2@app.com', N'$2a$11$hs0pzQTO4SuStxphB9aIfOQgfbqedjlOs0ubtZ6bxGz5rv.dF7hey', 2, 1, CAST(N'2026-05-22T06:18:57.420' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B6160B594E396]    Script Date: 09/06/2026 11:38:48 ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserRolesMapping]    Script Date: 09/06/2026 11:38:48 ******/
CREATE NONCLUSTERED INDEX [IX_UserRolesMapping] ON [dbo].[UserRolesMapping]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__tmp_ms_x__A9D105343FF47831]    Script Date: 09/06/2026 11:38:48 ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
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
ALTER TABLE [dbo].[UserDetail]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_ToRoles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_ToRoles]
GO
USE [master]
GO
ALTER DATABASE [MS_UserMgmt] SET  READ_WRITE 
GO
