using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Interfaces;
using NovaVerse.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurazione del database
builder.Services.AddDbContext<NovaVerseDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

// Registrazione dei servizi necessari
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPasswordEncoder, PasswordEncoder>();
builder.Services.AddScoped<IArtworkService, ArtworkService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IShoppingCartService, ShoppingCartService>();
builder.Services.AddScoped<IUserDashboardService, UserDashboardService>();
builder.Services.AddScoped<IArtistDashboardService, ArtistDashboardService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();


builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers(); // Aggiungi i controller per l'API

// Configurazione dell'autenticazione basata su cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/auth/login";  // Percorso per la pagina di login
        options.LogoutPath = "/auth/logout";  // Percorso per la pagina di logout
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);  // Durata del cookie
        options.SlidingExpiration = true;  // Rinnovo del cookie ad ogni richiesta
        options.AccessDeniedPath = "/Forbidden/";  // Percorso per accesso negato
    });


// Configurazione dell'autorizzazione con politiche personalizzate
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ArtistOnly", policy =>
        policy.RequireRole("Artist"));

    options.AddPolicy("ClientOnly", policy =>
        policy.RequireRole("Client"));  // Politica per il ruolo "Client"
});

// Configurazione del CORS per consentire richieste dall'app Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder => builder
        .WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());  // Consenti l'uso delle credenziali (cookie)
});

// Aggiungi supporto per Swagger (documentazione API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configura il middleware di sviluppo per Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Redirect per HTTPS
app.UseCors("AllowAngularApp"); // Abilita CORS per l'app Angular
app.UseAuthentication(); // Gestione dell'autenticazione
app.UseAuthorization();  // Gestione dell'autorizzazione

app.MapControllers(); // Mappa i controller per gestire le richieste API

app.Run(); // Avvia l'applicazione
