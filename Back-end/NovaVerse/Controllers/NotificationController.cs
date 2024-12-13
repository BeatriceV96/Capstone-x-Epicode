using Microsoft.AspNetCore.Mvc;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

[Route("api/notifications")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly NovaVerseDbContext _dbContext;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(NovaVerseDbContext dbContext, ILogger<NotificationController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // Ottieni notifiche per un utente
    [HttpGet("{receiverId}")]
    public async Task<IActionResult> GetNotifications(int receiverId)
    {
        try
        {
            var notifications = await _dbContext.Notifications
                .Where(n => n.ReceiverId == receiverId)
                .OrderByDescending(n => n.Date)
                .ToListAsync();

            if (!notifications.Any())
            {
                _logger.LogInformation($"Nessuna notifica trovata per ReceiverId: {receiverId}");
                return NotFound("Nessuna notifica trovata.");
            }

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                SenderId = n.SenderId,
                ReceiverId = n.ReceiverId,
                Message = n.Message,
                Link = n.Link,
                Date = n.Date,
                IsRead = n.IsRead
            }).ToList();

            return Ok(notificationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il recupero delle notifiche per ReceiverId: {ReceiverId}", receiverId);
            return StatusCode(500, "Errore interno del server.");
        }
    }

    // Aggiungi una notifica
    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Dati non validi.");
        }

        try
        {
            var senderExists = await _dbContext.Users.AnyAsync(u => u.Id == notificationDto.SenderId);
            var receiverExists = await _dbContext.Users.AnyAsync(u => u.Id == notificationDto.ReceiverId);

            if (!senderExists || !receiverExists)
            {
                return BadRequest("SenderId o ReceiverId non valido.");
            }

            var notification = new Notification
            {
                SenderId = notificationDto.SenderId,
                ReceiverId = notificationDto.ReceiverId,
                Message = notificationDto.Message,
                Link = notificationDto.Link,
                Date = DateTime.UtcNow,
                IsRead = false
            };

            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            return Ok(notificationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante la creazione della notifica.");
            return StatusCode(500, "Errore interno del server.");
        }
    }

    // Ottieni notifiche non lette
    [HttpGet("unread/{receiverId}")]
    public async Task<IActionResult> GetUnreadNotifications(int receiverId)
    {
        try
        {
            _logger.LogInformation($"Tentativo di recupero notifiche non lette per ReceiverId: {receiverId}");

            var notifications = await _dbContext.Notifications
                .Where(n => n.ReceiverId == receiverId && !n.IsRead)
                .OrderByDescending(n => n.Date)
                .ToListAsync();

            if (!notifications.Any())
            {
                _logger.LogInformation($"Nessuna notifica non letta trovata per ReceiverId: {receiverId}");
                return NotFound("Nessuna notifica non letta trovata.");
            }

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                SenderId = n.SenderId,
                ReceiverId = n.ReceiverId,
                Message = n.Message,
                Link = n.Link,
                Date = n.Date,
                IsRead = n.IsRead
            }).ToList();

            return Ok(notificationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il recupero delle notifiche non lette.");
            return StatusCode(500, "Errore interno del server.");
        }
    }


    // Segna tutte le notifiche come lette
    [HttpPut("mark-all-as-read/{receiverId}")]
    public async Task<IActionResult> MarkAllNotificationsAsRead(int receiverId)
    {
        try
        {
            var notifications = await _dbContext.Notifications
                .Where(n => n.ReceiverId == receiverId && !n.IsRead)
                .ToListAsync();

            if (!notifications.Any())
                return NotFound("Nessuna notifica da marcare come letta.");

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _dbContext.SaveChangesAsync();
            return Ok("Tutte le notifiche sono state marcate come lette.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il salvataggio delle notifiche come lette.");
            return StatusCode(500, "Errore interno del server.");
        }
    }


    // Segna una notifica come letta
    [HttpPut("mark-as-read/{id}")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        try
        {
            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (notification == null)
            {
                return NotFound("Notifica non trovata.");
            }

            notification.IsRead = true;
            await _dbContext.SaveChangesAsync();

            return Ok("Notifica marcata come letta.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il salvataggio della notifica come letta.");
            return StatusCode(500, "Errore interno del server.");
        }
    }

    [HttpGet("messages-and-notifications/{receiverId}")]
    public async Task<IActionResult> GetMessagesAndNotifications(int receiverId)
    {
        try
        {
            var unreadMessagesTask = _dbContext.Messages
                .Where(m => m.ReceiverId == receiverId && !m.IsRead)
                .ToListAsync();

            var unreadNotificationsTask = _dbContext.Notifications
                .Where(n => n.ReceiverId == receiverId && !n.IsRead)
                .ToListAsync();

            await Task.WhenAll(unreadMessagesTask, unreadNotificationsTask);

            var unreadMessages = unreadMessagesTask.Result;
            var unreadNotifications = unreadNotificationsTask.Result;

            _logger.LogInformation($"Trovati {unreadMessages.Count} messaggi non letti e {unreadNotifications.Count} notifiche non lette per ReceiverId: {receiverId}");

            if (!unreadMessages.Any() && !unreadNotifications.Any())
            {
                return NotFound("Nessun messaggio o notifica non letta trovata.");
            }

            var result = new CombinedDto
            {
                Messages = unreadMessages.Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead
                }).ToList(),
                Notifications = unreadNotifications.Select(n => new NotificationDto
                {
                    Id = n.Id,
                    SenderId = n.SenderId,
                    ReceiverId = n.ReceiverId,
                    Message = n.Message,
                    Link = n.Link,
                    Date = n.Date,
                    IsRead = n.IsRead
                }).ToList()
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il recupero di messaggi e notifiche.");
            return StatusCode(500, "Errore interno del server.");
        }
    }

}
