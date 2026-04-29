using System.Text.Json;

namespace AssetManagementAPI.Services
{
    public interface ILLMService
    {
        /// <summary>
        /// Send a natural language query to the configured LLM provider and return a structured JSON response.
        /// The service will instruct the model to return valid JSON; if the model returns non-JSON text the raw text will be returned under the key "text".
        /// </summary>
        /// <param name="query">Natural language query</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Parsed JSON document (guaranteed to be non-null)</returns>
        Task<JsonDocument> QueryAsync(string query, CancellationToken cancellationToken = default);
    }
}
