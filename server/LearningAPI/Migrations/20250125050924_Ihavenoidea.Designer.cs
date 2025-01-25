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
    [Migration("20250125050924_Ihavenoidea")]
    partial class Ihavenoidea
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("LearningAPI.Models.Attributes", b =>
                {
                    b.Property<int>("AttributesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AttributeDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("AttributeName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<int?>("PoliciesId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("AttributesId");

                    b.HasIndex("PoliciesId");

                    b.ToTable("Attributes");
                });

            modelBuilder.Entity("LearningAPI.Models.Policies", b =>
                {
                    b.Property<int>("PoliciesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("PoliciesDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("PoliciesName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<int>("ResourceId")
                        .HasColumnType("int");

                    b.Property<int>("ResourceTypeId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("PoliciesId");

                    b.HasIndex("ResourceId");

                    b.HasIndex("ResourceTypeId");

                    b.ToTable("Policies");
                });

            modelBuilder.Entity("LearningAPI.Models.Resource", b =>
                {
                    b.Property<int>("ResourceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("ResourceDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("ResourceName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<int>("ResourceTypeId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ResourceId");

                    b.HasIndex("ResourceTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Resources");
                });

            modelBuilder.Entity("LearningAPI.Models.ResourceType", b =>
                {
                    b.Property<int>("ResourceTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("ResourceTypeDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("TypeName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("ResourceTypeId");

                    b.ToTable("ResourceTypes");
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

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("LearningAPI.Models.UserAttributes", b =>
                {
                    b.Property<int>("UserAttributesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("AttributeId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime");

                    b.Property<string>("UserAttributeDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("varchar(500)");

                    b.Property<string>("UserAttributeName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("UserAttributesId");

                    b.HasIndex("UserId");

                    b.HasIndex("AttributeId", "UserId");

                    b.ToTable("UserAttributes");
                });

            modelBuilder.Entity("LearningAPI.Models.Attributes", b =>
                {
                    b.HasOne("LearningAPI.Models.Policies", "Policies")
                        .WithMany("RequiredAttributes")
                        .HasForeignKey("PoliciesId");

                    b.Navigation("Policies");
                });

            modelBuilder.Entity("LearningAPI.Models.Policies", b =>
                {
                    b.HasOne("LearningAPI.Models.Resource", "Resource")
                        .WithMany()
                        .HasForeignKey("ResourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LearningAPI.Models.ResourceType", "ResourceType")
                        .WithMany()
                        .HasForeignKey("ResourceTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Resource");

                    b.Navigation("ResourceType");
                });

            modelBuilder.Entity("LearningAPI.Models.Resource", b =>
                {
                    b.HasOne("LearningAPI.Models.ResourceType", "ResourceType")
                        .WithMany("Resource")
                        .HasForeignKey("ResourceTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany("Resource")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ResourceType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.UserAttributes", b =>
                {
                    b.HasOne("LearningAPI.Models.Attributes", "Attribute")
                        .WithMany()
                        .HasForeignKey("AttributeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LearningAPI.Models.User", "User")
                        .WithMany("UserAttributes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Attribute");

                    b.Navigation("User");
                });

            modelBuilder.Entity("LearningAPI.Models.Policies", b =>
                {
                    b.Navigation("RequiredAttributes");
                });

            modelBuilder.Entity("LearningAPI.Models.ResourceType", b =>
                {
                    b.Navigation("Resource");
                });

            modelBuilder.Entity("LearningAPI.Models.User", b =>
                {
                    b.Navigation("Resource");

                    b.Navigation("UserAttributes");
                });
#pragma warning restore 612, 618
        }
    }
}
