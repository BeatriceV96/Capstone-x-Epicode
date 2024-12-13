using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

[Route("api/messages")]
[ApiController]
public class MessageController : ControllerBase
{
    private readonly NovaVerseDbContext _dbContext;
    private readonly IMessageService _messageService;
    private readonly ILogger<MessageController> _logger;

    public MessageController(NovaVerseDbContext dbContext, IMessageService messageService, ILogger<MessageController> logger)
    {
        _dbContext = dbContext;
        _messageService = messageService; // Iniezione del servizio IMessageService
        _logger = logger;
    }

    [HttpGet("conversation/{senderId}/{receiverId}")]
    public async Task<IActionResult> GetConversation(int senderId, int receiverId)
    {
        try
        {
            var messages = await _dbContext.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                            (m.SenderId == receiverId && m.ReceiverId == senderId))
                .OrderBy(m => m.Timestamp)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead,
                    SenderUsername = m.Sender.Username,
                    ReceiverUsername = m.Receiver.Username,
                    SenderProfilePicture = string.IsNullOrEmpty(m.Sender.ProfilePicture) ?
                        "/uploads/default-profile.png" : m.Sender.ProfilePicture,
                    ReceiverProfilePicture = string.IsNullOrEmpty(m.Receiver.ProfilePicture) ?
                        "/uploads/default-profile.png" : m.Receiver.ProfilePicture
                })
                .ToListAsync();

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il recupero della conversazione.");
            return StatusCode(500, "Errore interno del server.");
        }
    }



    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] MessageDto messageDto)
    {
        try
        {
            var sender = await _dbContext.Users.FindAsync(messageDto.SenderId);
            var receiver = await _dbContext.Users.FindAsync(messageDto.ReceiverId);

            if (sender == null || receiver == null)
            {
                return BadRequest("Invalid sender or receiver.");
            }

            var message = new Message
            {
                SenderId = messageDto.SenderId,
                ReceiverId = messageDto.ReceiverId,
                Content = messageDto.Content,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            _dbContext.Messages.Add(message);
            await _dbContext.SaveChangesAsync();

            var sentMessage = new MessageDto
            {
                Id = message.Id,
                SenderId = sender.Id,
                ReceiverId = receiver.Id,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsRead = message.IsRead,
                SenderUsername = sender.Username,
                ReceiverUsername = receiver.Username,
                SenderProfilePicture = string.IsNullOrEmpty(sender.ProfilePicture) ?
                    "/uploads/default-profile.png" : sender.ProfilePicture,
                ReceiverProfilePicture = string.IsNullOrEmpty(receiver.ProfilePicture) ?
                    "/uploads/default-profile.png" : receiver.ProfilePicture
            };

            return Ok(sentMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante l'invio del messaggio.");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("unread/{receiverId}")]
    public async Task<IActionResult> GetUnreadMessages(int receiverId)
    {
        try
        {
            var messages = await _dbContext.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.ReceiverId == receiverId && !m.IsRead)
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead,
                    SenderUsername = m.Sender.Username,
                    ReceiverUsername = m.Receiver.Username,
                    SenderProfilePicture = m.Sender.ProfilePicture,
                    ReceiverProfilePicture = m.Receiver.ProfilePicture
                })
                .ToListAsync();

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore durante il recupero dei messaggi non letti.");
            return StatusCode(500, "Errore interno del server.");
        }
    }


}
