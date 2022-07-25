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
import pt.uc.dei.paj.service.ProjectService;
import pt.uc.dei.paj.service.UserService;

@Path("/projects")
public class ProjectController {

	@Inject
	ProjectService projectService;
	@Inject
	UserService userService;

	// create project
	@Path("/create")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createProject(@HeaderParam("token") String token, DTOProject projectDto) {

		if (token.isEmpty() || projectDto == null) {
			return Response.status(401).build();
		} else {
			System.out.println(projectDto);
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					projectService.createProject(projectDto, user);
					return Response.ok().build();

				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find all projects where:
	// find visible projects
	@Path("/findVisible")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getVisibleProjects() {

		try {

			List<DTOProject> dtoProjectList = projectService.findStatusProject(Status.visible);
			return Response.ok(dtoProjectList).build();

		} catch (Exception e) {
			//e.printStackTrace();
			return Response.status(401).build();
		}

	}

	// find invisible projects
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
					List<DTOProject> dtoProjectList = projectService.findStatusProject(Status.invisible);
					return Response.ok(dtoProjectList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find visible and invisible news
	@Path("/getProjectsVisAndInvs")
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
					List<DTOProject> dtoProjectList = projectService.findProjectVisAndInvis();
					return Response.ok(dtoProjectList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find deleted projects
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
					List<DTOProject> dtoProjectList = projectService.findStatusProject(Status.deleted);
					return Response.ok(dtoProjectList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// find project by id
	@Path("/get/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProjectById(@PathParam("id") String idAux) {

		try {

			return Response.ok(projectService.findProjectById(Integer.parseInt(idAux))).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}
	
	@Path("/members/list/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProjectCoauthorListById(@PathParam("id") String idAux) {
		try {

			return Response.ok(projectService.findProjectCoAuthorList(Integer.parseInt(idAux))).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}
	}

	// find projects em que user é membro
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
					return Response.ok(projectService.getProjectsUserCoAuthors(user)).build();
				}

			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// editar projecto
	@Path("/edit/{id}")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response editProject(@HeaderParam("token") String token, @PathParam("id") String idAux,
			DTOProject projectDto) {

		if (token.isEmpty() || projectDto == null) {
			return Response.status(401).build();
		} else {
			if (projectDto.getId() == Integer.parseInt(idAux)) {
				try {
					User user = userService.validateToken(token);
					if (user == null) {
						return Response.status(403).build();
					} else {
						projectService.editProject(projectDto, Integer.parseInt(idAux));
						return Response.ok().build();
					}
				} catch (Exception e) {
					return Response.status(401).build();
				}
			}
			return Response.status(401).build();

		}
	}

	// toggle only to project status
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
					projectService.toggleStatus(Integer.parseInt(id), status);
					return Response.ok().build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// manage project users
	@Path("/members/{projectId}")
	@POST
	public Response manageCoAuthors(@HeaderParam("token") String token,
			@PathParam("projectId") String id) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {

				User user = userService.validateToken(token);
				if (user == null) {
					return Response.status(403).build();
				} else {
					projectService.manageCoAuthors(Integer.parseInt(id), user);
					return Response.ok().build();
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

					List<DTOProject> myList = projectService.findMyProject(user);
					return Response.ok(myList).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}

	}

	// search projects that have those keywords
	@Path("/search/{keyword}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProjectListByKeyword(@HeaderParam("token") String token, @PathParam("keyword") String keyword) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					List<DTOProject> projectList = projectService.projectsWithKeywordsVisibleAndInvisible(keyword);
					return Response.ok(projectList).build();
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
	public Response getProjectListByKeywordOnlyVisible(@PathParam("keyword") String keyword) {

		try {

			List<DTOProject> projectList = projectService.projectsWithKeywordsVisible(keyword);
			return Response.ok(projectList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

	// get news associated with that project
	@Path("/{id}/news")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getNewsAssociatedWithProject(@PathParam("id") String projectId) {

		try {

			List<DTONewsPiece> newsList = projectService.getNewsAssociatedWithProject(Integer.parseInt(projectId));
			return Response.ok(newsList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}

	}

}
