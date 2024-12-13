using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDto>> GetConversationAsync(int senderId, int receiverId);
        Task<MessageDto> SendMessageAsync(MessageDto messageDto);
        Task<int> GetUnreadMessagesCountAsync(int userId);
        Task<IEnumerable<MessageDto>> GetUnreadMessagesAsync(int userId);
        Task<bool> MarkMessagesAsReadAsync(int[] messageIds);
    }
}
