﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NovaVerse.Context;

#nullable disable

namespace NovaVerse.Migrations
{
    [DbContext(typeof(NovaVerseDbContext))]
    [Migration("20240913211531_updateTrasnaction")]
    partial class updateTrasnaction
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("NovaVerse.Models.Artwork", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtistId")
                        .HasColumnType("int");

                    b.Property<int?>("BuyerId")
                        .HasColumnType("int");

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Photo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<int?>("TransactionId")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<int>("ViewCount")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtistId");

                    b.HasIndex("BuyerId");

                    b.HasIndex("CategoryId");

                    b.ToTable("Artworks");
                });

            modelBuilder.Entity("NovaVerse.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("NovaVerse.Models.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<string>("CommentText")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("NovaVerse.Models.Favorite", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("ArtistId")
                        .HasColumnType("int");

                    b.Property<int?>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtistId");

                    b.HasIndex("ArtworkId");

                    b.HasIndex("UserId");

                    b.ToTable("Favorites");
                });

            modelBuilder.Entity("NovaVerse.Models.NFTMetadata", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<string>("Blockchain")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("ContractAddress")
                        .IsRequired()
                        .HasMaxLength(42)
                        .HasColumnType("nvarchar(42)");

                    b.Property<string>("MetadataJson")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TokenId")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId")
                        .IsUnique();

                    b.ToTable("NFTMetadatas");
                });

            modelBuilder.Entity("NovaVerse.Models.PurchaseHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<int>("TransactionId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId");

                    b.HasIndex("TransactionId");

                    b.HasIndex("UserId");

                    b.ToTable("PurchaseHistories");
                });

            modelBuilder.Entity("NovaVerse.Models.ShoppingCart", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("ShoppingCarts");
                });

            modelBuilder.Entity("NovaVerse.Models.ShoppingCartItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<decimal>("PriceAtAddTime")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<int>("ShoppingCartId")
                        .HasColumnType("int");

                    b.Property<int?>("TransactionId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId");

                    b.HasIndex("ShoppingCartId");

                    b.HasIndex("TransactionId");

                    b.ToTable("ShoppingCartItems");
                });

            modelBuilder.Entity("NovaVerse.Models.Transaction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<int>("BuyerId")
                        .HasColumnType("int");

                    b.Property<string>("PaymentMethod")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("SellerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("TransactionStatus")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId")
                        .IsUnique();

                    b.HasIndex("BuyerId");

                    b.HasIndex("SellerId");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("NovaVerse.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("ProfilePicture")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TransactionArtworks", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ArtworkId")
                        .HasColumnType("int");

                    b.Property<int?>("ArtworkId1")
                        .HasColumnType("int");

                    b.Property<int>("TransactionId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ArtworkId");

                    b.HasIndex("ArtworkId1");

                    b.HasIndex("TransactionId");

                    b.ToTable("TransactionArtworks");
                });

            modelBuilder.Entity("NovaVerse.Models.Artwork", b =>
                {
                    b.HasOne("NovaVerse.Models.User", "Artist")
                        .WithMany("Artworks")
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.User", "Buyer")
                        .WithMany()
                        .HasForeignKey("BuyerId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("NovaVerse.Models.Category", "Category")
                        .WithMany("Artworks")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artist");

                    b.Navigation("Buyer");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("NovaVerse.Models.Comment", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithMany("Comments")
                        .HasForeignKey("ArtworkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artwork");

                    b.Navigation("User");
                });

            modelBuilder.Entity("NovaVerse.Models.Favorite", b =>
                {
                    b.HasOne("NovaVerse.Models.User", "Artist")
                        .WithMany()
                        .HasForeignKey("ArtistId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithMany("Favorites")
                        .HasForeignKey("ArtworkId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("NovaVerse.Models.User", "User")
                        .WithMany("Favorites")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artist");

                    b.Navigation("Artwork");

                    b.Navigation("User");
                });

            modelBuilder.Entity("NovaVerse.Models.NFTMetadata", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithOne("NFTMetadata")
                        .HasForeignKey("NovaVerse.Models.NFTMetadata", "ArtworkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artwork");
                });

            modelBuilder.Entity("NovaVerse.Models.PurchaseHistory", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithMany()
                        .HasForeignKey("ArtworkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.Transaction", "Transaction")
                        .WithMany()
                        .HasForeignKey("TransactionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.User", "User")
                        .WithMany("PurchaseHistories")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artwork");

                    b.Navigation("Transaction");

                    b.Navigation("User");
                });

            modelBuilder.Entity("NovaVerse.Models.ShoppingCart", b =>
                {
                    b.HasOne("NovaVerse.Models.User", "User")
                        .WithOne("ShoppingCart")
                        .HasForeignKey("NovaVerse.Models.ShoppingCart", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("NovaVerse.Models.ShoppingCartItem", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithMany("ShoppingCartItems")
                        .HasForeignKey("ArtworkId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.ShoppingCart", "ShoppingCart")
                        .WithMany("ShoppingCartItems")
                        .HasForeignKey("ShoppingCartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.Transaction", "Transaction")
                        .WithMany()
                        .HasForeignKey("TransactionId");

                    b.Navigation("Artwork");

                    b.Navigation("ShoppingCart");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("NovaVerse.Models.Transaction", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithOne("Transaction")
                        .HasForeignKey("NovaVerse.Models.Transaction", "ArtworkId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.User", "Buyer")
                        .WithMany("Transactions")
                        .HasForeignKey("BuyerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.User", "Seller")
                        .WithMany()
                        .HasForeignKey("SellerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Artwork");

                    b.Navigation("Buyer");

                    b.Navigation("Seller");
                });

            modelBuilder.Entity("TransactionArtworks", b =>
                {
                    b.HasOne("NovaVerse.Models.Artwork", "Artwork")
                        .WithMany()
                        .HasForeignKey("ArtworkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("NovaVerse.Models.Artwork", null)
                        .WithMany("TransactionArtworks")
                        .HasForeignKey("ArtworkId1");

                    b.HasOne("NovaVerse.Models.Transaction", "Transaction")
                        .WithMany("TransactionArtworks")
                        .HasForeignKey("TransactionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Artwork");

                    b.Navigation("Transaction");
                });

            modelBuilder.Entity("NovaVerse.Models.Artwork", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Favorites");

                    b.Navigation("NFTMetadata")
                        .IsRequired();

                    b.Navigation("ShoppingCartItems");

                    b.Navigation("Transaction")
                        .IsRequired();

                    b.Navigation("TransactionArtworks");
                });

            modelBuilder.Entity("NovaVerse.Models.Category", b =>
                {
                    b.Navigation("Artworks");
                });

            modelBuilder.Entity("NovaVerse.Models.ShoppingCart", b =>
                {
                    b.Navigation("ShoppingCartItems");
                });

            modelBuilder.Entity("NovaVerse.Models.Transaction", b =>
                {
                    b.Navigation("TransactionArtworks");
                });

            modelBuilder.Entity("NovaVerse.Models.User", b =>
                {
                    b.Navigation("Artworks");

                    b.Navigation("Comments");

                    b.Navigation("Favorites");

                    b.Navigation("PurchaseHistories");

                    b.Navigation("ShoppingCart")
                        .IsRequired();

                    b.Navigation("Transactions");
                });
#pragma warning restore 612, 618
        }
    }
}
