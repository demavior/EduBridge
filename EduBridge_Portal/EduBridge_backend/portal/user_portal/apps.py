from django.apps import AppConfig

class UserPortalConfig(AppConfig):
    name = 'user_portal'

    def ready(self):
        import user_portal.signals
