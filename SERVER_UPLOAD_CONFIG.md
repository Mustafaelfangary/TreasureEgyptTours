# Server Configuration for File Uploads

## Nginx Configuration (if using Nginx)

Add these directives to your nginx configuration file:

```nginx
server {
    # ... your existing configuration

    # Increase file upload limits
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Increase buffer sizes
    client_body_buffer_size 128k;
    client_header_buffer_size 32k;
    large_client_header_buffers 8 64k;

    # Proxy settings (if using proxy_pass to Node.js)
    proxy_read_timeout 300s;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_request_buffering off;
    
    location /api/upload {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Specific upload settings
        client_max_body_size 50M;
        proxy_request_buffering off;
    }
    
    location /api/admin/media/upload {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Specific upload settings
        client_max_body_size 50M;
        proxy_request_buffering off;
    }
    
    location /api/media/upload {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Specific upload settings
        client_max_body_size 50M;
        proxy_request_buffering off;
    }

    # ... rest of your configuration
}
```

## Apache Configuration (if using Apache)

Add to your `.htaccess` or virtual host configuration:

```apache
# Increase upload limits
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300
php_value max_input_time 300

# For virtual hosts
<VirtualHost *:80>
    # ... your existing configuration
    
    LimitRequestBody 52428800  # 50MB in bytes
    
    # ... rest of your configuration
</VirtualHost>
```

## PM2 Configuration Update

Update your `ecosystem.config.js` to handle larger requests:

```javascript
module.exports = {
  apps: [
    {
      name: 'Dahabiyat-Nile-Cruise',
      script: 'npm',
      args: 'start',
      cwd: '/var/Dahabiyat-Nile-Cruise',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add these for larger requests
        NODE_OPTIONS: '--max-old-space-size=2048',
        UV_THREADPOOL_SIZE: 4
      },
      // ... rest of your configuration
    }
  ]
};
```

## Commands to run on your VPS

After updating configurations:

```bash
# Test nginx configuration (if using nginx)
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart PM2 process
pm2 restart Dahabiyat-Nile-Cruise

# Check logs
pm2 logs Dahabiyat-Nile-Cruise
```

## Common 413 Error Solutions

1. **Check which web server you're using:**
   ```bash
   ps aux | grep -E "(nginx|apache|httpd)"
   ```

2. **Find nginx configuration file:**
   ```bash
   sudo find /etc -name "nginx.conf" 2>/dev/null
   sudo find /etc -name "*.conf" | grep nginx
   ```

3. **Edit nginx configuration:**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   # or
   sudo nano /etc/nginx/sites-available/your-site
   ```

4. **Check current limits:**
   ```bash
   # Check nginx config
   nginx -T | grep client_max_body_size
   
   # Check disk space
   df -h
   ```

## Testing the fix

After making these changes, test with:

```bash
# Test small file upload first
curl -X POST -F "file=@small-test.jpg" http://yourdomain.com/api/media/upload

# Test larger file
curl -X POST -F "file=@large-test.jpg" http://yourdomain.com/api/media/upload
```
