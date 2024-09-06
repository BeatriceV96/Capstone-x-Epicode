<div class="container mx-auto mt-8">
  <div class="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-white mb-6">Register</h2>

    <!-- Messaggi di successo o errore -->
    <div *ngIf="successMessage" class="bg-green-500 text-white p-3 rounded mb-4">
      {{ successMessage }}
    </div>
    <div *ngIf="errorMessage" class="bg-red-500 text-white p-3 rounded mb-4">
      {{ errorMessage }}
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div class="form-group mb-4">
        <label for="username" class="block text-sm text-white mb-2">Username</label>
        <input formControlName="username" id="username" placeholder="Enter Username"
               class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black placeholder-gray-400 border border-gray-500" />
      </div>

      <div class="form-group mb-4">
        <label for="email" class="block text-sm text-white mb-2">Email</label>
        <input formControlName="email" id="email" type="email" placeholder="Enter Email"
               class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black placeholder-gray-400 border border-gray-500" />
      </div>

      <div class="form-group mb-4">
        <label for="password" class="block text-sm text-white mb-2">Password</label>
        <input formControlName="password" id="password" type="password" placeholder="Password"
               class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black placeholder-gray-400 border border-gray-500" />
      </div>

      <div class="form-group mb-4">
        <label for="role" class="block text-sm text-white mb-2">Role</label>
        <select formControlName="role"
                class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black border border-gray-500">
          <option value="Artist">Artist</option>
          <option value="Buyer">Buyer</option>
        </select>
      </div>

      <div class="form-group mb-4">
        <label for="profilePictureUrl" class="block text-sm text-white mb-2">Profile Picture URL</label>
        <input formControlName="profilePictureUrl" id="profilePictureUrl" placeholder="Profile Picture URL"
               class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black placeholder-gray-400 border border-gray-500" />
      </div>

      <div class="form-group mb-6">
        <label for="bio" class="block text-sm text-white mb-2">Bio</label>
        <textarea formControlName="bio" id="bio" placeholder="Tell us about yourself"
                  class="form-control w-full px-4 py-2 rounded-lg bg-gray-600 text-black placeholder-gray-400 border border-gray-500"></textarea>
      </div>

      <button type="submit" class="btn btn-primary w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              [disabled]="registerForm.invalid">
        Register
      </button>
    </form>

    <!-- Messaggio per il login -->
    <div class="mt-4 text-center">
      <p class="text-sm text-white">Sei già registrato?
        <a routerLink="/auth/login" class="text-blue-400 hover:underline">Accedi qui!</a>
      </p>
    </div>
  </div>
</div>
