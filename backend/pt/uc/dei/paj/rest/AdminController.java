package pt.uc.dei.paj.rest;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.service.AdminService;
import pt.uc.dei.paj.service.UserService;

@Path("/admin")
public class AdminController {

	@Inject
	UserService userService;
	@Inject
	AdminService adminService;

	// método usado apenas no postman para registar o admin
	@Path("/registerAdmin")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response registerFirstAdmin(DTOUser userDto) {

		if (userDto == null) {
			return Response.status(401).build();
		} else {
			try {

				userDto.setType(Type.admin);
				userService.createAdmin(userDto);
				return Response.ok(userDto).build();

			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// approve/disapprove status do user
	@Path("/updateToMember/{username}")
	@POST
	public Response updateUser(@PathParam("username") String username, @HeaderParam("token") String token) {

		if (token.isEmpty() || username.isEmpty()) {
			return Response.status(401).build();

		} else {
			try {

				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					if (user.getType().equals(Type.admin)) {

						User userToUpdate = userService.getUserByUsername(username);
						boolean passed = userService.upgradeToMember(userToUpdate);

						if (passed) {

							return Response.ok().build();
						}

						return Response.status(401).build();
					} else {
						return Response.status(401).build();
					}
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// update member to admin
	@Path("/updateToAdmin/{username}")
	@POST
	public Response updateMember(@PathParam("username") String username, @HeaderParam("token") String token) {

		if (token.isEmpty() || username.isEmpty()) {
			return Response.status(401).build();

		} else {

			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					if (user.getType().equals(Type.admin)) {
						User memberToUpgrade = userService.getUserByUsername(username);
						boolean passed = userService.upgradeToAdmin(memberToUpgrade);

						if (passed) {
							return Response.ok().build();
						}

						return Response.status(401).build();
					} else {
						return Response.status(401).build();
					}
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}
	}

	// delete user
	@Path("/delete/{username}")
	@DELETE
	public Response deleteUser(@PathParam("username") String username, @HeaderParam("token") String token) {

		if (token.isEmpty() || username.isEmpty()) {
			return Response.status(401).build();

		} else {

			try {
				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {

					if (user.getType().equals(Type.admin)) {
						User memberToDelete = userService.getUserByUsername(username);
						userService.deleteUser(memberToDelete);

						return Response.ok().build();

					} else {
						return Response.status(401).build();
					}
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}
		}

	}

	// list things
	// list all registered users (members and admins)
	@Path("/listAllUsers")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response listAllUsers(@HeaderParam("token") String token) {

		if (token.isEmpty()) {
			return Response.status(401).build();
		} else {

			try {

				User user = userService.validateToken(token);

				if (user == null) {
					return Response.status(403).build();
				} else {
					if (user.getType().equals(Type.admin)) {

						List<DTOUser> userList = userService.listUsers();
						return Response.ok(userList).build();
					}
					return Response.status(401).build();
				}
			} catch (Exception e) {
				return Response.status(401).build();
			}

		}
	}
}
