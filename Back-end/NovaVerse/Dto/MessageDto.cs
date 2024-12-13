public class MessageDto
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
    public string SenderUsername { get; set; }
    public string ReceiverUsername { get; set; }
    public string SenderProfilePicture { get; set; }
    public string ReceiverProfilePicture { get; set; }
}
