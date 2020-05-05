from rest_framework import negotiation

class RestrictApiView(negotiation.DefaultContentNegotiation):

    def select_parser(self, request, parsers):
        """
        Given a list of parsers and a media type, return the appropriate
        parser to handle the incoming request.
        """
        return super().select_parser(request, parsers)

    def select_renderer(self, request, renderers, format_suffix):
        # if not request.user.is_authenticated:
        #     format_suffix='html'

        format_query_param = self.settings.URL_FORMAT_OVERRIDE
        format = format_suffix or request.query_params.get(format_query_param)

        if format == 'api' and not request.user.is_authenticated:
            format = 'html'

        return super().select_renderer(request, renderers, format)
