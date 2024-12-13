using NovaVerse.Dto;

public class CombinedDto
{
    public List<MessageDto> Messages { get; set; } = new List<MessageDto>();
    public List<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();
}
