﻿// <auto-generated />
using System;
using LearningAPI;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LearningAPI.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20250204094516_AddResetToken")]
    partial class AddResetToken
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("LearningAPI.Models.BookmarkFolder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("BookmarkFolders");
                });

            modelBuilder.Entity("LearningAPI.Models.BookmarkRecipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("BookmarkFolderId")
                        .HasColumnType("int");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("RecipeId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("BookmarkFolderId");

                    b.ToTable("BookmarkRecipes");
                });

            modelBuilder.Entity("LearningAPI.Models.FoodWasteEntry", b =>
                {
                    b.Property<int>("WasteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<DateTime>("LoggedOn")
                        .HasColumnType("datetime");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("WasteAmount")
                        .HasColumnType("int");

                    b.Property<string>("WasteReason")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.HasKey("WasteId");

                    b.HasIndex("UserId");

                    b.ToTable("FoodWasteEntries");
                });

            modelBuilder.Entity("LearningAPI.Models.Fridge", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("ExpiryDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("IngredientName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<double>("Quantity")
                        .HasColumnType("double");

                    b.Property<string>("Unit")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Fridges");
                });

            modelBuilder.Entity("LearningAPI.Models.SustainabilityBadge", b =>
                {
                    b.Property<int>("BadgeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("AwardedOn")
                        .HasColumnType("datetime");

                    b.Property<string>("BadgeDescription")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("BadgeName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("BadgeId");

                    b.HasIndex("UserId");

                    b.ToTable("SustainabilityBadges");
                });

            modelBuilder.Entity("LearningAPI.Models.SustainabilityGoal", b =>
                {
                    b.Property<int>("SustainabilityGoalId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CurrentValue")
                        .HasColumnType("int");

                    b.Property<DateTime>("Deadline")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("GoalDescription")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("GoalName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("TargetValue")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("SustainabilityGoalId");

                    b.HasIndex("UserId");

                    b.ToTable("SustainabilityGoals");
                });

            modelBuilder.Entity("LearningAPI.Models.Tutorial", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("ImageFile")
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Tutorials");
                });

            modelBuilder.Entity("LearningAPI.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("Image")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("ResetToken")
                        .HasColumnType("longtext");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("TokenExpiration")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("LearningAPI.Models.BookmarkRecipe", b =>
                {
                    b.HasOne("LearningAPI.Models.BookmarkFolder", null)
                        .WithMany("Recipes")
                        .HasForeignKey("BookmarkFolderId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("LearningAPI.Models.FoodWasteEntry", b =>
                {
                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.SustainabilityBadge", b =>
                {
                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.SustainabilityGoal", b =>
                {
                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.Tutorial", b =>
                {
                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany("Tutorials")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.BookmarkFolder", b =>
                {
                    b.Navigation("Recipes");
                });

            modelBuilder.Entity("LearningAPI.Models.User", b =>
                {
                    b.Navigation("Tutorials");
                });
#pragma warning restore 612, 618
        }
    }
}
