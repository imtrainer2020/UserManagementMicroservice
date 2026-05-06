using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuditLogService.API.Models;
using AuditLogService.API.Data;

[Route("api/[controller]")]
[ApiController]
public class AuditLogsController : ControllerBase
{
    private readonly AuditLogDbContext _context;
    public AuditLogsController(AuditLogDbContext context)
    {
        _context = context;
    }

    // GET: api/AuditLog
    [HttpGet]
    public async Task<ActionResult<IList<AuditLog>>> GetAuditLog()
    {
        return await _context.AuditLogs.ToListAsync();
    }

    // GET: api/AuditLog/5
    [HttpGet("{id}")]
    public async Task<ActionResult<AuditLog>> GetAuditLog(int id)
    {
        var auditlog = await _context.AuditLogs.FindAsync(id);

        if (auditlog == null)
        {
            return NotFound();
        }

        return auditlog;
    }

    // PUT: api/AuditLog/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAuditLog(int? id, AuditLog auditlog)
    {
        if (id != auditlog.Id)
        {
            return BadRequest();
        }

        _context.Entry(auditlog).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AuditLogExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/AuditLog
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<AuditLog>> PostAuditLog(AuditLog auditlog)
    {
        _context.AuditLogs.Add(auditlog);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAuditLog", new { id = auditlog.Id }, auditlog);
    }

    // DELETE: api/AuditLog/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuditLog(int? id)
    {
        var auditlog = await _context.AuditLogs.FindAsync(id);
        if (auditlog == null)
        {
            return NotFound();
        }

        _context.AuditLogs.Remove(auditlog);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AuditLogExists(int? id)
    {
        return _context.AuditLogs.Any(e => e.Id == id);
    }
}
