﻿using Microsoft.EntityFrameworkCore;
using NovaVerse.Models;

namespace NovaVerse.Context
{
    public class NovaVerseDbContext : DbContext
    {
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Artwork> Artworks { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public virtual DbSet<NFTMetadata> NFTMetadatas { get; set; }
        public virtual DbSet<Favorite> Favorites { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
        public virtual DbSet<PurchaseHistory> PurchaseHistories { get; set; }
        public virtual DbSet<TransactionArtworks> TransactionArtworks { get; set; }

        public NovaVerseDbContext(DbContextOptions<NovaVerseDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relazione uno-a-molti tra Transaction e User (Buyer)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Buyer)
                .WithMany(u => u.Transactions) // Considera di rimuovere se non necessario
                .HasForeignKey(t => t.BuyerId)
                .OnDelete(DeleteBehavior.Restrict); 

            // Relazione uno-a-molti tra Transaction e User (Seller)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Seller)
                .WithMany() 
                .HasForeignKey(t => t.SellerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevenzione di cicli

            // Relazione uno-a-molti tra Artwork e User (Artist)
            modelBuilder.Entity<Artwork>()
                .HasOne(a => a.Artist)
                .WithMany(u => u.Artworks)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.Restrict); // Evita eliminazioni a cascata che potrebbero causare cicli

            // Relazione opzionale uno-a-molti tra Artwork e User (Buyer)
            modelBuilder.Entity<Artwork>()
                .HasOne(a => a.Buyer)
                .WithMany() // Non mappato su Buyer navigational property per evitare cicli
                .HasForeignKey(a => a.BuyerId)
                .OnDelete(DeleteBehavior.Restrict); 

            // Relazione uno-a-uno tra ShoppingCart e User
            modelBuilder.Entity<ShoppingCart>()
                .HasOne(c => c.User)
                .WithOne(u => u.ShoppingCart)
                .HasForeignKey<ShoppingCart>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Consentito poiché si tratta di una relazione uno-a-uno

            // Relazione uno-a-molti tra ShoppingCartItem e ShoppingCart
            modelBuilder.Entity<ShoppingCartItem>()
                .HasOne(ci => ci.ShoppingCart)
                .WithMany(c => c.ShoppingCartItems)
                .HasForeignKey(ci => ci.ShoppingCartId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Relazione uno-a-molti tra ShoppingCartItem e Artwork
            modelBuilder.Entity<ShoppingCartItem>()
                .HasOne(ci => ci.Artwork)
                .WithMany(a => a.ShoppingCartItems)
                .HasForeignKey(ci => ci.ArtworkId)
                .OnDelete(DeleteBehavior.Restrict); 

            // Relazione uno-a-uno tra Artwork e NFTMetadata
            modelBuilder.Entity<Artwork>()
                .HasOne(a => a.NFTMetadata)
                .WithOne(nft => nft.Artwork)
                .HasForeignKey<NFTMetadata>(nft => nft.ArtworkId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Relazione uno-a-uno tra Artwork e Transaction
            modelBuilder.Entity<Artwork>()
                .HasOne(a => a.Transaction)
                .WithOne(t => t.Artwork)
                .HasForeignKey<Artwork>(a => a.TransactionId)
                .OnDelete(DeleteBehavior.Restrict); 

            // Relazione uno-a-molti tra TransactionArtworks e Transaction
            modelBuilder.Entity<TransactionArtworks>()
                .HasOne(ta => ta.Transaction)
                .WithMany()
                .HasForeignKey(ta => ta.TransactionId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Relazione uno-a-molti tra TransactionArtworks e Artwork
            modelBuilder.Entity<TransactionArtworks>()
                .HasOne(ta => ta.Artwork)
                .WithMany()
                .HasForeignKey(ta => ta.ArtworkId)
                .OnDelete(DeleteBehavior.Cascade); 

            base.OnModelCreating(modelBuilder);
        }
    }
}