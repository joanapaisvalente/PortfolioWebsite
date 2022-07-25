package pt.uc.dei.paj.rest;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import pt.uc.dei.paj.dto.DTONewsPiece;
import pt.uc.dei.paj.dto.DTOProject;
import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.Status;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.service.NewsService;
import pt.uc.dei.paj.service.UserService;

@Path("/news")
public class NewsPieceController {

	@Inject
	NewsService newsService;
	@Inject
	UserService userService;

	// não foi testado NADAAAAAAA DESTA VIDA
	@Path("/create")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createNewsPiece(@HeaderParam("token") String token, DTONewsPiece dtoNews) {

		if (token.isEmpty() || dtoNews == null) {
			return Response.status(401).build();
		} else {

			try {

				User user = userService.validateToken(token);

				if (user == null) {

					return Response.status(403).build();
				} else {
					newsService.createNewsPiece(dtoNews, user);
					return Response.ok().build();
				}
			} catch (Exception e) {
				e.printStackTrace();
				return Response.status(401).build();
			}

		}
	}

	// find newspiece by id
	@Path("/get/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProjectById(@PathParam("id") String idAux) {

		try {

			return Response.ok(newsService.findNewsPieceById(Integer.parseInt(idAux))).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}
	}

	// find all news where:
	// find visible news
	@Path("/findVisible")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getVisibleProjects() {

		try {

			List<DTONewsPiece> dtoNewsList = newsService.findStatusNewsPiece(Status.visible);
			return Response.ok(dtoNewsList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

	// find invisible news
	@Path("/findInvisible")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getInvisibleProjects(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					List<DTONewsPiece> dtoNewsList = newsService.findStatusNewsPiece(Status.invisible);
					return Response.ok(dtoNewsList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find visible and invisible news
	@Path("/getNewsVisAndInvs")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNews(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					List<DTONewsPiece> dtoNewsList = newsService.findNewsVisAndInvis();
					return Response.ok(dtoNewsList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find deleted news
	@Path("/findDeleted")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDeletedProjects(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					List<DTONewsPiece> dtoNewsList = newsService.findStatusNewsPiece(Status.deleted);
					return Response.ok(dtoNewsList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find news em que user é membro
	@Path("/coAuthory")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getListOfProjectsUserCoAuthors(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {

				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					return Response.ok(newsService.getNewsUserCoAuthors(user)).build();
				}

			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find all projects that person with this token owns
	@Path("/owned")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getListUsers(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					List<DTONewsPiece> myList = newsService.findMyNews(user);
					return Response.ok(myList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}

	}

	// manage co authors
	@Path("/members/{newsId}")
	@POST
	public Response manageCoAuthors(@HeaderParam("token") String token,
			@PathParam("newsId") String id) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {

				User user = userService.validateToken(token);
				if (user == null) {
					return Response.status(403).build();
				} else {
					newsService.manageCoAuthors(Integer.parseInt(id), user);
					return Response.ok().build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// editar notícia
	@Path("/edit/{id}")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response editProject(@HeaderParam("token") String token, @PathParam("id") String idAux,
			DTONewsPiece newsDto) {

		if (token.isEmpty() || newsDto == null) {
			return Response.status(401).build();
		} else {
			if (newsDto.getId() == Integer.parseInt(idAux)) {
				try {
					User user = userService.validateToken(token);
					if (user == null) {
						return Response.status(403).build();
					} else {
						newsService.editNewsPiece(newsDto, Integer.parseInt(idAux));
						return Response.ok().build();
					}
				} catch (Exception e) {
					return Response.status(401).build();
				}
			}
			return Response.status(401).build();

		}
	}

	// toggle only to news status
	@Path("/toggle/{id}")
	@POST
	public Response toggleStatus(@HeaderParam("token") String token, @HeaderParam("status") String status,
			@PathParam("id") String id) {

		if (token.isEmpty() || id.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					newsService.toggleStatus(Integer.parseInt(id), status);
					return Response.ok().build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// lista de membros de uma dada notícia
	@Path("/members/list/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMemberListFromProject(@PathParam("id") String newsId) {

		try {

			List<DTOUser> memberList = newsService.memberList(Integer.parseInt(newsId));
			return Response.ok(memberList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

	// search projects that have those keywords
	@Path("/search/{keyword}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNewsListByKeyword(@HeaderParam("token") String token, @PathParam("keyword") String keyword) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					List<DTONewsPiece> newsList = newsService.newsWithKeywordsVisibleAndInvisible(keyword);
					return Response.ok(newsList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// search projects that have those keywords
	@Path("/search/visible/{keyword}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNewsListByKeywordOnlyVisible(@PathParam("keyword") String keyword) {

		try {

			List<DTONewsPiece> newsList = newsService.newsWithKeywordsVisible(keyword);
			return Response.ok(newsList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

	// associate news piece with project
	@Path("/unite/{idProject}/with/{idNews}")
	@POST
	public Response uniteNewsAndProject(@HeaderParam("token") String token, @PathParam("idProject") String idProject,
			@PathParam("idNews") String idNews) {

		if (token.isEmpty() || idProject.isEmpty() || idNews.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					newsService.associateNewsPieceAndProject(Integer.parseInt(idProject), Integer.parseInt(idNews));
					return Response.ok().build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// TODO DESASSOCIAR
	@Path("/desassociate/{idProject}/and/{idNews}")
	@POST
	public Response desassociateProjectAndNews(@HeaderParam("token") String token,
			@PathParam("idProject") String idProject, @PathParam("idNews") String idNews) {

		if (token.isEmpty() || idProject.isEmpty() || idNews.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					newsService.desassociateNewsPieceAndProject(Integer.parseInt(idProject), Integer.parseInt(idNews));
					return Response.ok().build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// get projects associated with that news
	@Path("/{id}/projects")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNewsAssociatedWithProject(@PathParam("id") String newsId) {
		try {

			List<DTOProject> projectList = newsService.getProjectsAssociatedWithNewsPiece(Integer.parseInt(newsId));
			return Response.ok(projectList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

}
