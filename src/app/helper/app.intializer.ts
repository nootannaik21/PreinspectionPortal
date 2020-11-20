import { ApiService } from '../service/api.service';

export function appInitializer(apiService: ApiService) {
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        var LoginId = localStorage.getItem('userLoginId')
        apiService.refreshToken(LoginId)
            .subscribe(data => 
                {
                    localStorage.setItem('currentUser',JSON.stringify(data));
            })
            .add(resolve);
    });
}