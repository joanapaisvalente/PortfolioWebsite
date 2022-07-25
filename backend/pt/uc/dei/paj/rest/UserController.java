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

import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.service.UserService;

@Path("/users")
public class UserController {

	@Inject
	UserService userService;

	/*@Path("/teste")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response teste() {
		return Response.ok("lol").build();
	}*/

	// registo quando antes de qualquer login na front end
	@Path("/register")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUser(DTOUser userDto) {

		if (userDto == null) {

			return Response.status(401).build();

		} else {

			try {
				userService.createUser(userDto);
				return Response.ok().build();
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}
	
	@Path("/listUsers")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response listUsersAvailable(@HeaderParam("token") String token) {
		
		if(token.isEmpty()) {
			return Response.status(401).build();
		} else {
			try {

				User user = userService.validateToken(token);
				
				if(user == null) {
					return Response.status(403).build();
				} else {
					List<DTOUser> availableUsers = userService.findAvailableUsers(user.getUsername());
				return Response.ok(availableUsers).build();
				}
				

			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
		
	}

	// login de forma a conceder o token
	@Path("/login")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public Response loginUser(@HeaderParam("username") String username, @HeaderParam("password") String password) {

		if (!username.isEmpty() || !password.isEmpty()) {

			try {
				String response = userService.loginUser(username, password);

				System.out.println(response);
				if (response == null) {
					return Response.status(403).build();

				} else if (response == "") {
					
					return Response.status(444).build();
					
				} else {
					response = '"' + response + '"';
					return Response.ok(response).build();
				}

			} catch (Exception e) {
				return Response.status(401).build();
			}
		} else {
			return Response.status(401).build();
		}

	}

	// get dos dados do utilizador
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();

		} else {

			try {
				User userAux = userService.validateToken(token);

				if (userAux == null) {
					return Response.status(403).build();
				} else {

					DTOUser dtoUser = userService.findUser(userAux.getUsername());

					if (dtoUser == null) {
						return Response.status(401).build();
					} else {
						return Response.ok(dtoUser).build();
					}

				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// list all registered admins
	@Path("/listAllAdmins")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response listAllAdmins() {

		try {

			List<DTOUser> userList = userService.listAdmins();
			return Response.ok(userList).build();

		} catch (Exception e) {
			return Response.status(401).build();
		}
	}

	// logout do utilizador - retira o token da base de dados
	@Path("/logout")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response logout(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();

		} else {
			try {

				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					boolean passed = userService.logout(user);

					if (passed) {
						return Response.ok().build();
					}
					return Response.status(401).build();

				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// edit profile
	@Path("/editProfile")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response editProfile(@HeaderParam("token") String token, DTOUser userDto) {

		if (token.isEmpty() || userDto == null) {
			return Response.status(401).build();
		} else {
			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					if (user.getUsername().equals(userDto.getUsername())) {
						userService.editProfile(userDto, user);
						return Response.ok().build();
					}
					return Response.status(401).build();

				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

}
