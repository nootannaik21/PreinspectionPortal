import { ApiService } from '../service/api.service';

export function appInitializer(apiService: ApiService) {
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        apiService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}