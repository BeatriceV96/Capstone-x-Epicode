﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NovaVerse.Models
{
    public class TransactionArtworks
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int TransactionId { get; set; }
        public virtual Transaction Transaction { get; set; }

        [Required]
        public int ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }
    }
}