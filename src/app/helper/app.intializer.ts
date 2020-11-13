import { ApiService } from '../service/api.service';

export function appInitializer(apiService: ApiService) {
    debugger;
    return () => new Promise(resolve => {
        debugger;
        alert("app-initializer");
        // attempt to refresh token on app start up to auto authenticate
        apiService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}