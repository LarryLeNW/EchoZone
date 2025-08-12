using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeApi.DTOs
{
    public class PagingQuery
    {
        private const int MaxPageSize = 200;
        private int _pageSize = 20;

        public int Page { get; set; } = 1;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : (value <= 0 ? 20 : value);
        }
        public string? SortBy { get; set; }
        public string? SortDir { get; set; } = "asc";
    }
    
    public class PagedResult<T>
    {
        public required IReadOnlyList<T> Items { get; init; }
        public required int Page { get; init; }
        public required int PageSize { get; init; }
        public required int TotalItems { get; init; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
        public bool HasNext => Page < TotalPages;
        public bool HasPrevious => Page > 1;
    }


}