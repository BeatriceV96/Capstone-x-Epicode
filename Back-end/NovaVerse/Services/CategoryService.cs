﻿using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly NovaVerseDbContext _context;

        public CategoryService(NovaVerseDbContext context)
        {
            _context = context;
        }

        // Restituisce tutte le categorie
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        // Restituisce una singola categoria per ID
        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

        // Aggiunge una nuova categoria
        public async Task<Category> AddCategoryAsync(CategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        // Aggiorna una categoria esistente
        public async Task<Category> UpdateCategoryAsync(int id, CategoryDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return null;  // Se la categoria non esiste, restituisce null
            }

            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;

            await _context.SaveChangesAsync();
            return category;
        }

        // Cancella una categoria esistente
        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.Include(c => c.Artworks).FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
            {
                return false;
            }

            // Rimuovi tutte le opere collegate
            _context.Artworks.RemoveRange(category.Artworks);

            // Rimuovi la categoria
            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<List<ArtworkDto>> GetArtworksByCategoryAsync(int categoryId)
        {
            var artworks = await _context.Artworks
                .Where(a => a.CategoryId == categoryId)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Photo = a.Photo
                })
                .ToListAsync();

            return artworks;
        }

    }
}
