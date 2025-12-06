const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sports_travel_token');
  }
  return null;
};

// Create headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Events API
export const eventsApi = {
  // Get all events
  getAll: async (params?: { category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `${API_URL}/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get single event
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Create event
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update event
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete event
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  }
};

// Packages API
export const packagesApi = {
  // Get all packages
  getAll: async (params?: { eventId?: string; tier?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.eventId) queryParams.append('eventId', params.eventId);
    if (params?.tier) queryParams.append('tier', params.tier);
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `${API_URL}/packages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get single package
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/packages/${id}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Create package
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/packages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update package
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/packages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete package
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/packages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  }
};

// Leads API
export const leadsApi = {
  // Get all leads
  getAll: async (params?: { status?: string; event?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.event) queryParams.append('event', params.event);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_URL}/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get single lead
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Create lead
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update lead
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete lead
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  },

  // Get lead status history
  getHistory: async (id: string) => {
    const response = await fetch(`${API_URL}/leads/${id}/history`, {
      headers: getHeaders()
    });
    return response.json();
  }
};

// Quotes API
export const quotesApi = {
  // Get all quotes
  getAll: async (params?: { status?: string; leadId?: string; eventId?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.leadId) queryParams.append('leadId', params.leadId);
    if (params?.eventId) queryParams.append('eventId', params.eventId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_URL}/quotes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get single quote
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/quotes/${id}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Generate quote
  generate: async (data: any) => {
    const response = await fetch(`${API_URL}/quotes/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update quote
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/quotes/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete quote
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/quotes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  }
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get recent leads
  getRecentLeads: async (limit = 5) => {
    const response = await fetch(`${API_URL}/dashboard/recent-leads?limit=${limit}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get recent quotes
  getRecentQuotes: async (limit = 5) => {
    const response = await fetch(`${API_URL}/dashboard/recent-quotes?limit=${limit}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Get revenue statistics
  getRevenueStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/revenue`, {
      headers: getHeaders()
    });
    return response.json();
  }
};
