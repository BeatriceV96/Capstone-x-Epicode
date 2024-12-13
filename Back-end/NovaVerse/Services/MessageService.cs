using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MessageService : IMessageService
{
    private readonly NovaVerseDbContext _dbContext;

    public MessageService(NovaVerseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<MessageDto>> GetConversationAsync(int senderId, int receiverId)
    {
        var messages = await _dbContext.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                        (m.SenderId == receiverId && m.ReceiverId == senderId))
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            ReceiverId = m.ReceiverId,
            SenderUsername = m.Sender.Username,
            ReceiverUsername = m.Receiver.Username,
            SenderProfilePicture = m.Sender.ProfilePicture,
            ReceiverProfilePicture = m.Receiver.ProfilePicture,
            Content = m.Content,
            Timestamp = m.Timestamp,
            IsRead = m.IsRead
        });
    }

    public async Task<MessageDto> SendMessageAsync(MessageDto messageDto)
    {
        // Recupera i dettagli dei mittenti e destinatari
        var sender = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == messageDto.SenderId);
        var receiver = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == messageDto.ReceiverId);

        if (sender == null || receiver == null)
        {
            throw new Exception("Mittente o destinatario non valido.");
        }

        // Creazione del messaggio
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

        // Restituisci il messaggio con i dettagli di Sender e Receiver
        return new MessageDto
        {
            Id = message.Id,
            SenderId = sender.Id,
            ReceiverId = receiver.Id,
            Content = message.Content,
            Timestamp = message.Timestamp,
            IsRead = message.IsRead,
            SenderUsername = sender.Username,
            ReceiverUsername = receiver.Username,
            SenderProfilePicture = sender.ProfilePicture,
            ReceiverProfilePicture = receiver.ProfilePicture
        };
    }


    public async Task<bool> MarkMessagesAsReadAsync(int[] messageIds)
    {
        var messages = await _dbContext.Messages
            .Where(m => messageIds.Contains(m.Id) && !m.IsRead)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
        }

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetUnreadMessagesCountAsync(int userId)
    {
        return await _dbContext.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .CountAsync();
    }

    public async Task<IEnumerable<MessageDto>> GetUnreadMessagesAsync(int userId)
    {
        var messages = await _dbContext.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .Include(m => m.Sender) // Includi i dati del mittente
            .ToListAsync();

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            SenderId = m.SenderId,
            ReceiverId = m.ReceiverId,
            Content = m.Content,
            Timestamp = m.Timestamp,
            IsRead = m.IsRead,
            SenderUsername = m.Sender.Username,
            SenderProfilePicture = m.Sender.ProfilePicture,
        });
    }

}
